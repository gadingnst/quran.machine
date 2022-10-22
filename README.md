# quran.machine

> Automatic share Qur'an verses in Instagram / Telegram. Deploy on Serverless Service [Vercel](https://vercel.com).

## Related System
#### [Bot (Telegram Account)](https://t.me/QuranMachine_bot)
#### [Bot (Instagram Account)](https://instagram.com/quran.machine)
#### [Puppet Source Code](https://github.com/sutanlab/quran.machine-puppeteer)

## Running on local
### Install Depedencies
```
npm run install
```

### Steps
- You must have [ngrok](https://ngrok.com) on your machine.
- Run `ngrok http 3000`, you will get `Public URL` for your machine.
- Set `Public URL` on `.env`, and then Set other environment that you have.
- Run `npm run dev`.
- Go to `{YOUR_LOCAL_URL}/api/telegram/webhook?key={YOUR_SECRET_KEY}` to initial Telegram webhook. (You must also do this for deployments).

## Support Me
### Global
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/gadingnst)
### Indonesia
- [Trakteer](https://trakteer.id/gadingnst)
- [Karyakarsa](https://karyakarsa.com/gadingnst)

---
Best Regards, Sutan Gading Fadhillah Nasution.
