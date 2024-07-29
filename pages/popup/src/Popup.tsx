import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';

const Popup = () => {
  return <div className="font-bold">Hello</div>;
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
