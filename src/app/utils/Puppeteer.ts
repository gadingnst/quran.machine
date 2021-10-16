import Chrome from 'chrome-aws-lambda';
import { IS_PRODUCTION } from 'utils/config';

const Puppeteer = async () => {
  const executablePath = await Chrome.executablePath;
  return Chrome.puppeteer.launch({
    executablePath,
    args: Chrome.args,
    headless: IS_PRODUCTION,
    ignoreHTTPSErrors: true
  });
};

export default Puppeteer;
