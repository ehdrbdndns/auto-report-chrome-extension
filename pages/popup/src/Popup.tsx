import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';

const Popup = () => {
  return (
    <section>
      {/* Header */}
      <header></header>
      {/* Main */}
      <div>
        {/* Left */}

        {/* Right */}
      </div>
    </section>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
