
import React from 'react';
import { BusinessData, GeneratedPlaybook } from '../../types';
import FullPlaybookHtml from './FullPlaybookHtml';

interface AllHtmlProps {
    playbook: GeneratedPlaybook;
    businessData: BusinessData;
}

const AllHtml: React.FC<AllHtmlProps> = ({ playbook, businessData }) => {
    return <FullPlaybookHtml playbook={playbook} />;
};

export default AllHtml;
