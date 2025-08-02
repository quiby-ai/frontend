# frontend
The [frontend] is an UI responsible for handling all client-related actions across the platform.

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_LOGIN_ENDPOINT=/login
```

For production, update these values to point to your actual API gateway:
```env
VITE_API_BASE_URL=https://your-api-gateway.com
VITE_LOGIN_ENDPOINT=/auth/telegram
```

## Authentication Flow

Uses Telegram Mini App authentication with SDK v3:
- Sends POST request with `Authorization: tma {initData}` header  
- Stores JWT token in SessionStorage
- Auto-syncs with user's Telegram theme

### Implementation
```typescript
import { init, retrieveRawInitData } from '@telegram-apps/sdk';

init();
const initDataRaw = retrieveRawInitData();

fetch('https://example.com/api', {
  method: 'POST',
  headers: { Authorization: `tma ${initDataRaw}` }
});
```

## Customization

### Colors
Edit `src/index.css` variables:
```css
--background: 255 255 255;
--primary: 9 9 11;
--text-primary: 9 9 11;
```

### Design System
- Shadcn/ui professional theme
- Inter/Nunito typography
- Accessible color contrasts
