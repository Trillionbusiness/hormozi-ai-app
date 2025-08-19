
import React from 'react';
import { GeneratedPlaybook } from '../../types';
import FullPlaybook from '../FullPlaybook';

interface FullPlaybookHtmlProps {
  playbook: GeneratedPlaybook;
}

const FullPlaybookHtml: React.FC<FullPlaybookHtmlProps> = ({ playbook }) => {
  const emptyFunc = () => {};
  const emptyChat = { history: [], isLoading: false, onSendMessage: emptyFunc };
  
  return (
    <FullPlaybook
      playbook={playbook}
      isStatic={true}
      // Provide dummy props for functions not used in static mode
      onDownloadAsset={emptyFunc}
      onPreviewAsset={emptyFunc}
      isAnyPdfGenerating={false}
      generatingAsset={null}
      onDownloadAllAssets={emptyFunc}
      generatingAssetBundleFor={null}
      chatHistory={[]}
      isChatLoading={false}
      onSendMessage={emptyFunc}
      pdfProgress={0}
    />
  );
};

export default FullPlaybookHtml;
