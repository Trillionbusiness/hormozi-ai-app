
import React from 'react';
import { GeneratedPlaybook } from '../../types';
import FullPlaybook from '../FullPlaybook';

interface FullPlaybookHtmlProps {
  playbook: GeneratedPlaybook;
}

const FullPlaybookHtml: React.FC<FullPlaybookHtmlProps> = ({ playbook }) => {
  const emptyFunc = () => {};
  
  return (
    <FullPlaybook
      playbook={playbook}
      isStatic={true}
      // Provide dummy props for functions not used in static mode
      onPreviewAsset={emptyFunc}
      onDownloadAssetBundle={emptyFunc}
      chatHistory={[]}
      isChatLoading={false}
      onSendMessage={emptyFunc}
    />
  );
};

export default FullPlaybookHtml;
