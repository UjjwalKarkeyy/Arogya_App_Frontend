# Arogya App Setup Guide

## Quick Start

1. **Start Backend Server**:
   ```bash
   cd e:\GitHub_Windows\Arogya_Test_Backend
   python manage.py runserver 0.0.0.0:8000
   ```

2. **Start Frontend App**:
   ```bash
   cd e:\GitHub_Windows\Arogya_Test_App_Frontend
   npm start
   ```

## Configuration Fixed

### API Configuration
- **Web**: `http://127.0.0.1:8000`
- **Mobile/Expo**: `http://192.168.1.74:8000`
- **Android Emulator**: `http://192.168.1.74:8000`

### Django Settings Fixed
- Added your IP address to `ALLOWED_HOSTS`
- CORS enabled for all origins
- Database: PostgreSQL (complaint_feedback_db)

## Mobile Device Setup

1. Install Expo Go app on your phone
2. Connect to same WiFi network as your computer
3. Scan QR code from Expo Dev Tools
4. App will connect to: `http://192.168.1.74:8000/api/`

## API Endpoints Available

- **Surveys**: `/api/surveys/`
- **Doctors**: `/api/doctors/`
- **Complaints**: `/api/complains/`
- **News**: `/api/news/`
- **Health Content**: `/api/content/`

## Troubleshooting

1. **Connection Issues**: Ensure both devices on same network
2. **Server Not Starting**: Check PostgreSQL is running
3. **API Errors**: Check Django server logs in terminal

## Database Setup (if needed)

```bash
cd e:\GitHub_Windows\Arogya_Test_Backend
python manage.py makemigrations
python manage.py migrate
```
