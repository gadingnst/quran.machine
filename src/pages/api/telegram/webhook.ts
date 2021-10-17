import TelegramController from 'app/controllers/Telegram';
import verifySecretKey from 'app/middlewares/verifySecretKey';
import verifyTelegramBotToken from 'app/middlewares/verifyTelegramBotToken';
import withMethod from 'app/utils/withMethod';
import withMiddleware from 'app/utils/withMiddleware';

const withVerifySecret = withMiddleware(verifySecretKey);
const withVerifyBotToken = withMiddleware(verifyTelegramBotToken);

export default withMethod({
  GET: withVerifySecret(TelegramController.init),
  POST: withVerifyBotToken(TelegramController.listen)
});
