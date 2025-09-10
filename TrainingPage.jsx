import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, CheckCircle, XCircle, BookOpen } from 'lucide-react'
import axios from 'axios'

const TrainingPage = ({ user, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [answerResult, setAnswerResult] = useState(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    loadQuestion()
  }, [])

  const loadQuestion = async () => {
    setLoading(true)
    setError('')
    setShowResult(false)
    setSelectedAnswer(null)
    
    try {
      const response = await axios.get('/api/daily-questions')
      
      if (response.data.success) {
        setCurrentQuestion(response.data.question)
        setQuestionsAnswered(response.data.questions_answered)
      } else {
        setError(response.data.message)
        if (response.data.questions_answered >= 10) {
          setCompleted(true)
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ في تحميل السؤال')
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (selectedAnswer === null) return
    
    setLoading(true)
    
    try {
      const response = await axios.post('/api/submit-answer', {
        question_id: currentQuestion.id,
        selected_answer: selectedAnswer
      })
      
      if (response.data.success) {
        setAnswerResult(response.data)
        setShowResult(true)
        setQuestionsAnswered(response.data.questions_answered)
        
        if (response.data.completed_daily_limit) {
          setCompleted(true)
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ في إرسال الإجابة')
    } finally {
      setLoading(false)
    }
  }

  const nextQuestion = () => {
    if (completed) {
      onBack()
    } else {
      loadQuestion()
    }
  }

  if (loading && !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>جاري تحميل السؤال...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={onBack}>العودة للوحة التحكم</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تهانينا!</h2>
            <p className="text-gray-600 mb-4">لقد أكملت 10 أسئلة لهذا اليوم</p>
            <Button onClick={onBack} className="w-full">
              العودة للوحة التحكم
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span className="font-semibold">جلسة التدريب</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">التقدم</span>
            <span className="text-sm font-medium">{questionsAnswered}/10</span>
          </div>
          <Progress value={(questionsAnswered / 10) * 100} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {currentQuestion && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-right">
                عطر: {currentQuestion.perfume_name}
              </CardTitle>
              <CardDescription className="text-right text-lg">
                {currentQuestion.question}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-right rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${
                    showResult && answerResult?.is_correct && selectedAnswer === index
                      ? 'border-green-500 bg-green-50'
                      : showResult && !answerResult?.is_correct && selectedAnswer === index
                      ? 'border-red-500 bg-red-50'
                      : showResult && answerResult?.correct_answer_text === answer
                      ? 'border-green-500 bg-green-50'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{answer}</span>
                    {showResult && answerResult?.correct_answer_text === answer && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {showResult && !answerResult?.is_correct && selectedAnswer === index && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </button>
              ))}

              {/* Result Message */}
              {showResult && (
                <div className={`p-4 rounded-lg text-center ${
                  answerResult?.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {answerResult?.is_correct ? (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>إجابة صحيحة! أحسنت</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <XCircle className="w-5 h-5" />
                      <span>إجابة خاطئة. الإجابة الصحيحة محددة أعلاه</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {!showResult ? (
                  <Button 
                    onClick={submitAnswer} 
                    disabled={selectedAnswer === null || loading}
                    className="flex-1"
                  >
                    {loading ? 'جاري الإرسال...' : 'تأكيد الإجابة'}
                  </Button>
                ) : (
                  <Button onClick={nextQuestion} className="flex-1">
                    {completed ? 'إنهاء الجلسة' : 'السؤال التالي'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default TrainingPage

