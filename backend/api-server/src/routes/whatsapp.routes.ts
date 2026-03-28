import { Router, Request, Response } from 'express';
import { whatsappService } from '../services/whatsapp.service';

const router = Router();

// GET /whatsapp/webhook - Verify webhook
router.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified');
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// POST /whatsapp/webhook - Handle incoming messages
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Return 200 immediately
    res.status(200).send('OK');

    // Process message asynchronously
    if (data.object) {
      const entries = data.entry;
      
      for (const entry of entries) {
        const changes = entry.changes;
        
        for (const change of changes) {
          if (change.field === 'messages') {
            const messages = change.value.messages;
            
            if (messages && messages.length > 0) {
              const message = messages[0];
              const from = message.from; // WhatsApp user's phone number
              
              if (message.type === 'text') {
                const text = message.text.body.toLowerCase().trim();
                
                // Handle different message types
                if (text === 'book' || text === 'booking') {
                  await whatsappService.sendBookingInstructions(from);
                } else if (text === 'status') {
                  // TODO: Find patient by phone and send queue status
                  await whatsappService.sendTextMessage(
                    from, 
                    'To check your queue status, please provide your registered mobile number and hospital name.'
                  );
                } else if (text === 'help') {
                  await whatsappService.sendHelpMenu(from);
                } else if (text === 'doctors') {
                  await whatsappService.sendTextMessage(
                    from, 
                    'To see available doctors, please visit app.clinicmind.in or specify your hospital name.'
                  );
                } else {
                  await whatsappService.sendHelpMenu(from);
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    // Don't send error response since we already sent 200
  }
});

export default router;
