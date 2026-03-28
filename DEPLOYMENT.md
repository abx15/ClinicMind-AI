# ClinicMind AI - Production Deployment Guide

## Overview
This guide covers deploying ClinicMind AI to production with 4 separate frontend apps and 2 backend services.

## Architecture
- **Patient App**: https://app.clinicmind.in (Vercel)
- **Hospital App**: https://manage.clinicmind.in (Vercel) 
- **Admin App**: https://admin.clinicmind.in (Vercel)
- **API Server**: https://api.clinicmind.in (Render)
- **AI Service**: https://ai.clinicmind.in (Render)

## Prerequisites
- Node.js 18+
- pnpm package manager
- Vercel account
- Render account
- Domain names configured

## Step 1: Install Dependencies
```bash
pnpm install
```

## Step 2: Deploy Frontend Apps (Vercel)

### Patient App
```bash
cd apps/patient-app
vercel --prod
# Set custom domain: app.clinicmind.in
```

### Hospital App  
```bash
cd apps/hospital-app
vercel --prod
# Set custom domain: manage.clinicmind.in
```

### Admin App
```bash
cd apps/admin-app
vercel --prod
# Set custom domain: admin.clinicmind.in
```

### Environment Variables for each Vercel project:
```
NEXT_PUBLIC_API_URL=https://api.clinicmind.in/api/v1
NEXT_PUBLIC_SOCKET_URL=https://api.clinicmind.in
NEXT_PUBLIC_AI_URL=https://ai.clinicmind.in/api/v1
NEXT_PUBLIC_PATIENT_URL=https://app.clinicmind.in
NEXT_PUBLIC_HOSPITAL_URL=https://manage.clinicmind.in
NEXT_PUBLIC_ADMIN_URL=https://admin.clinicmind.in
```

## Step 3: Deploy Backend Services (Render)

### API Server (Node.js)
The `render.yaml` file is already configured in `backend/api-server/`.

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Select the `backend/api-server` directory
4. Render will auto-detect the configuration from `render.yaml`

### AI Service (Python FastAPI)
The `render.yaml` file is already configured in `backend/ai-service/`.

1. Create another Web Service
2. Select the `backend/ai-service` directory  
3. Render will auto-detect the configuration

### Required Environment Variables on Render:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URLS=https://app.clinicmind.in,https://manage.clinicmind.in,https://admin.clinicmind.in
AI_SERVICE_URL=https://ai.clinicmind.in
```

## Step 4: Update CORS Configuration

The API server should automatically use the `FRONTEND_URLS` environment variable for CORS origins.

## Step 5: Configure Custom Domains

### Vercel
- Add custom domains in each Vercel project dashboard
- Configure DNS records to point to Vercel

### Render  
- Add custom domains in Render dashboard
- Configure DNS records to point to Render

## Step 6: SSL/HTTPS
All services will automatically get SSL certificates:
- Vercel provides automatic SSL
- Render provides automatic SSL

## Step 7: Test Production URLs

Verify all apps are working:
1. https://app.clinicmind.in - Patient app
2. https://manage.clinicmind.in - Hospital app  
3. https://admin.clinicmind.in - Admin app
4. https://api.clinicmind.in/health - API health check
5. https://ai.clinicmind.in/docs - AI service docs

## Step 8: Test Authentication Flow

1. Register a new hospital on patient app
2. Login as hospital admin on hospital app
3. Login as superadmin on admin app
4. Approve the hospital in admin panel
5. Verify hospital appears on patient app

## Step 9: Monitoring

Set up monitoring for:
- API response times
- Error rates
- Database performance
- AI service availability

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check FRONTEND_URLS environment variable
2. **Authentication failures**: Verify JWT_SECRET is same across services
3. **Database connection**: Check MONGODB_URI format
4. **AI service errors**: Verify API keys are valid

### Logs:
- Check Vercel Function Logs for frontend issues
- Check Render Logs for backend issues
- Monitor MongoDB logs for database issues

## Production Checklist

- [ ] All environment variables set
- [ ] Custom domains configured
- [ ] SSL certificates active
- [ ] CORS properly configured
- [ ] Authentication flow working
- [ ] Database connection stable
- [ ] AI service responding
- [ ] Error monitoring setup
- [ ] Backup strategy in place
- [ ] Performance monitoring active

## Security Notes

- Use strong, unique JWT_SECRET
- Rotate API keys regularly
- Monitor for suspicious activity
- Keep dependencies updated
- Use HTTPS everywhere
- Implement rate limiting
- Set up database backups

## Support

For deployment issues:
1. Check Vercel and Render documentation
2. Review service logs
3. Test environment variables
4. Verify network connectivity between services
