import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, User, Shield } from 'lucide-react'
import axios from 'axios'

const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Admin login state
  const [adminData, setAdminData] = useState({
    username: '',
    password: ''
  })
  
  // Employee login state
  const [employeeData, setEmployeeData] = useState({
    region: '',
    city: '',
    store: '',
    name: '',
    password: ''
  })

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post('/api/login', {
        user_type: 'admin',
        username: adminData.username,
        password: adminData.password
      })
      
      if (response.data.success) {
        onLogin(response.data)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ في تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  const handleEmployeeLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post('/api/login', {
        user_type: 'employee',
        region: employeeData.region,
        city: employeeData.city,
        store: employeeData.store,
        name: employeeData.name,
        password: employeeData.password
      })
      
      if (response.data.success) {
        onLogin(response.data)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ في تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">نظام التدريب والنتائج</CardTitle>
          <CardDescription>مرحباً بك، يرجى تسجيل الدخول للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employee" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="employee" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                موظف
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                مشرف
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin" className="space-y-4">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">اسم المستخدم</Label>
                  <Input
                    id="admin-username"
                    type="text"
                    value={adminData.username}
                    onChange={(e) => setAdminData({...adminData, username: e.target.value})}
                    placeholder="admin"
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={adminData.password}
                      onChange={(e) => setAdminData({...adminData, password: e.target.value})}
                      placeholder="كلمة المرور"
                      required
                      className="text-right pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="employee" className="space-y-4">
              <form onSubmit={handleEmployeeLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="region">المنطقة</Label>
                  <Input
                    id="region"
                    type="text"
                    value={employeeData.region}
                    onChange={(e) => setEmployeeData({...employeeData, region: e.target.value})}
                    placeholder="اسم المنطقة"
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Input
                    id="city"
                    type="text"
                    value={employeeData.city}
                    onChange={(e) => setEmployeeData({...employeeData, city: e.target.value})}
                    placeholder="اسم المدينة"
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store">المعرض</Label>
                  <Input
                    id="store"
                    type="text"
                    value={employeeData.store}
                    onChange={(e) => setEmployeeData({...employeeData, store: e.target.value})}
                    placeholder="اسم المعرض"
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-name">اسم الموظف</Label>
                  <Input
                    id="employee-name"
                    type="text"
                    value={employeeData.name}
                    onChange={(e) => setEmployeeData({...employeeData, name: e.target.value})}
                    placeholder="اسم الموظف"
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-password">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="employee-password"
                      type={showPassword ? "text" : "password"}
                      value={employeeData.password}
                      onChange={(e) => setEmployeeData({...employeeData, password: e.target.value})}
                      placeholder="كلمة المرور"
                      required
                      className="text-right pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage

