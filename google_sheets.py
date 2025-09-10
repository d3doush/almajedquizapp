import os
import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import openpyxl
from io import BytesIO

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']

class GoogleSheetsService:
    def __init__(self):
        self.service = None
        self.drive_service = None
        self.spreadsheet_id = None
        
    def authenticate(self, credentials_file=None, token_file=None):
        """Authenticate with Google Sheets API"""
        creds = None
        
        # The file token.json stores the user's access and refresh tokens.
        if token_file and os.path.exists(token_file):
            creds = Credentials.from_authorized_user_file(token_file, SCOPES)
            
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            elif credentials_file and os.path.exists(credentials_file):
                flow = InstalledAppFlow.from_client_secrets_file(credentials_file, SCOPES)
                creds = flow.run_local_server(port=0)
            else:
                # For demo purposes, we'll create a mock service
                print("Warning: No Google credentials found. Using mock service.")
                return False
                
            # Save the credentials for the next run
            if token_file:
                with open(token_file, 'w') as token:
                    token.write(creds.to_json())

        try:
            self.service = build('sheets', 'v4', credentials=creds)
            self.drive_service = build('drive', 'v3', credentials=creds)
            return True
        except Exception as e:
            print(f"Error building service: {e}")
            return False
    
    def create_spreadsheet(self, title="Training Data"):
        """Create a new spreadsheet"""
        if not self.service:
            return None
            
        try:
            spreadsheet = {
                'properties': {
                    'title': title
                }
            }
            
            spreadsheet = self.service.spreadsheets().create(
                body=spreadsheet,
                fields='spreadsheetId'
            ).execute()
            
            self.spreadsheet_id = spreadsheet.get('spreadsheetId')
            
            # Create the required sheets
            self.setup_sheets()
            
            return self.spreadsheet_id
            
        except HttpError as error:
            print(f"An error occurred: {error}")
            return None
    
    def setup_sheets(self):
        """Setup the required sheets with headers"""
        if not self.service or not self.spreadsheet_id:
            return False
            
        try:
            # Get current sheets
            spreadsheet = self.service.spreadsheets().get(
                spreadsheetId=self.spreadsheet_id
            ).execute()
            
            sheets = spreadsheet.get('sheets', [])
            sheet_names = [sheet['properties']['title'] for sheet in sheets]
            
            # Rename first sheet to 'staff' if it's 'Sheet1'
            if 'Sheet1' in sheet_names:
                self.service.spreadsheets().batchUpdate(
                    spreadsheetId=self.spreadsheet_id,
                    body={
                        'requests': [{
                            'updateSheetProperties': {
                                'properties': {
                                    'sheetId': sheets[0]['properties']['sheetId'],
                                    'title': 'staff'
                                },
                                'fields': 'title'
                            }
                        }]
                    }
                ).execute()
            
            # Create additional sheets
            requests = []
            if 'تدريباتي' not in sheet_names:
                requests.append({
                    'addSheet': {
                        'properties': {
                            'title': 'تدريباتي'
                        }
                    }
                })
            
            if 'علامتي' not in sheet_names:
                requests.append({
                    'addSheet': {
                        'properties': {
                            'title': 'علامتي'
                        }
                    }
                })
            
            if requests:
                self.service.spreadsheets().batchUpdate(
                    spreadsheetId=self.spreadsheet_id,
                    body={'requests': requests}
                ).execute()
            
            # Add headers
            self.add_headers()
            
            return True
            
        except HttpError as error:
            print(f"An error occurred: {error}")
            return False
    
    def add_headers(self):
        """Add headers to all sheets"""
        if not self.service or not self.spreadsheet_id:
            return False
            
        try:
            # Staff sheet headers
            staff_headers = [['المنطقة', 'المدينة', 'المعرض', 'اسم الموظف', 'كلمة المرور']]
            self.service.spreadsheets().values().update(
                spreadsheetId=self.spreadsheet_id,
                range='staff!A1:E1',
                valueInputOption='RAW',
                body={'values': staff_headers}
            ).execute()
            
            # Training sheet headers
            training_headers = [['اسم العطر', 'السؤال', 'إجابة 1', 'إجابة 2', 'إجابة 3', 'إجابة 4', 'الإجابة الصحيحة']]
            self.service.spreadsheets().values().update(
                spreadsheetId=self.spreadsheet_id,
                range='تدريباتي!A1:G1',
                valueInputOption='RAW',
                body={'values': training_headers}
            ).execute()
            
            # Scores sheet headers
            scores_headers = [['تاريخ الإجابة', 'اسم الموظف', 'اسم المعرض', 'النتيجة']]
            self.service.spreadsheets().values().update(
                spreadsheetId=self.spreadsheet_id,
                range='علامتي!A1:D1',
                valueInputOption='RAW',
                body={'values': scores_headers}
            ).execute()
            
            return True
            
        except HttpError as error:
            print(f"An error occurred: {error}")
            return False
    
    def read_sheet_data(self, sheet_name, range_name=None):
        """Read data from a sheet"""
        if not self.service or not self.spreadsheet_id:
            return []
            
        try:
            if range_name:
                range_name = f"{sheet_name}!{range_name}"
            else:
                range_name = sheet_name
                
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=range_name
            ).execute()
            
            values = result.get('values', [])
            return values
            
        except HttpError as error:
            print(f"An error occurred: {error}")
            return []
    
    def write_sheet_data(self, sheet_name, range_name, values):
        """Write data to a sheet"""
        if not self.service or not self.spreadsheet_id:
            return False
            
        try:
            range_name = f"{sheet_name}!{range_name}"
            
            self.service.spreadsheets().values().update(
                spreadsheetId=self.spreadsheet_id,
                range=range_name,
                valueInputOption='RAW',
                body={'values': values}
            ).execute()
            
            return True
            
        except HttpError as error:
            print(f"An error occurred: {error}")
            return False
    
    def append_sheet_data(self, sheet_name, values):
        """Append data to a sheet"""
        if not self.service or not self.spreadsheet_id:
            return False
            
        try:
            self.service.spreadsheets().values().append(
                spreadsheetId=self.spreadsheet_id,
                range=sheet_name,
                valueInputOption='RAW',
                insertDataOption='INSERT_ROWS',
                body={'values': values}
            ).execute()
            
            return True
            
        except HttpError as error:
            print(f"An error occurred: {error}")
            return False

# Mock service for demo purposes
class MockGoogleSheetsService:
    def __init__(self):
        self.data = {
            'staff': [
                ['المنطقة', 'المدينة', 'المعرض', 'اسم الموظف', 'كلمة المرور'],
                ['الرياض', 'الرياض', 'معرض النخيل', 'أحمد محمد', '123456'],
                ['جدة', 'جدة', 'معرض البحر', 'فاطمة أحمد', '654321'],
            ],
            'تدريباتي': [
                ['اسم العطر', 'السؤال', 'إجابة 1', 'إجابة 2', 'إجابة 3', 'إجابة 4', 'الإجابة الصحيحة'],
                ['عود ملكي', 'ما هي المكونات الأساسية لهذا العطر؟', 'العود والورد', 'الياسمين والعنبر', 'المسك والصندل', 'الفانيليا والبرغموت', 'C'],
                ['عطر الليل', 'متى يُفضل استخدام هذا العطر؟', 'في الصباح', 'في المساء', 'في الظهيرة', 'في أي وقت', 'D'],
            ],
            'علامتي': [
                ['تاريخ الإجابة', 'اسم الموظف', 'اسم المعرض', 'النتيجة'],
            ]
        }
    
    def authenticate(self, credentials_file=None, token_file=None):
        return True
    
    def read_sheet_data(self, sheet_name, range_name=None):
        return self.data.get(sheet_name, [])
    
    def append_sheet_data(self, sheet_name, values):
        if sheet_name in self.data:
            self.data[sheet_name].extend(values)
            return True
        return False
    
    def write_sheet_data(self, sheet_name, range_name, values):
        # For simplicity, just append the data
        return self.append_sheet_data(sheet_name, values)

