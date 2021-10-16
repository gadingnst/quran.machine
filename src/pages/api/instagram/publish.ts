// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import InstagramController from 'app/controllers/Instagram';
import verifySecretKey from 'app/middlewares/verifySecretKey';
import withMethod from 'app/utils/withMethod';
import withMiddleware from 'app/utils/withMiddleware';

const withVerifySecretKey = withMiddleware(verifySecretKey);

export default withMethod({
  GET: withVerifySecretKey(InstagramController.publish)
});
