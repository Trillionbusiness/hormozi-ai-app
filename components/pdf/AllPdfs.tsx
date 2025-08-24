
import React from 'react';
import { GeneratedPlaybook, OfferStackItem, GeneratedOffer, BusinessData } from '../../types';
import FullPlaybookPdf from './FullPlaybookPdf';
import KpiDashboardPdf from './KpiDashboardPdf';
import AccountabilityTrackerPdf from './AccountabilityTrackerPdf';
import OfferPresentationPdf from './OfferPresentationPdf';
import DownsellPamphletPdf from './DownsellPamphletPdf';
import TripwireFollowupPdf from './TripwireFollowupPdf';
import CfaModelPdf from './CfaModelPdf';
import ValueStackAssetsPdf from './ValueStackAssetsPdf';
import AssetPdf from './AssetPdf';
import LandingPagePdf from './LandingPagePdf';
import ZipGuidePdf from './ZipGuidePdf';
import ConceptsGuidePdf from './ConceptsGuidePdf';
import MiniClarityReportPdf from './MiniClarityReportPdf';

interface AllPdfsProps {
    playbook: GeneratedPlaybook;
    businessData: BusinessData;
    type: string | null;
    assetBundle?: GeneratedOffer | null;
    singleAsset?: NonNullable<OfferStackItem['asset']> | null;
}

const AllPdfs: React.FC<AllPdfsProps> = ({ playbook, businessData, type, assetBundle, singleAsset }) => {
    const sanitizeName = (name: string) => name.replace(/[\\/:*?"<>|]/g, '').replace(/ /g, '_');

    if (type === 'all') {
        return (
            <div style={{ width: '800px', backgroundColor: 'white' }}>
                <div data-pdf-output data-pdf-path="00_START_HERE_Guide.pdf"><ZipGuidePdf businessData={businessData} playbook={playbook} /></div>
                
                {/* 01 Core Plan */}
                <div data-pdf-output data-pdf-path="01_Core_Plan/Full_Business_Playbook.pdf"><FullPlaybookPdf playbook={playbook} /></div>
                <div data-pdf-output data-pdf-path="01_Core_Plan/AI_Mini_Clarity_Report.pdf"><MiniClarityReportPdf playbook={playbook} businessData={businessData} /></div>
                <div data-pdf-output data-pdf-path="01_Core_Plan/Business_Concepts_Guide.pdf"><ConceptsGuidePdf playbook={playbook} businessData={businessData} /></div>
                <div data-pdf-output data-pdf-path="01_Core_Plan/Business_Scorecard_(KPIs).pdf"><KpiDashboardPdf kpiDashboard={playbook.kpiDashboard} /></div>
                <div data-pdf-output data-pdf-path="01_Core_Plan/Growth_Experiment_Tracker.pdf"><AccountabilityTrackerPdf tracker={playbook.accountabilityTracker} /></div>
                <div data-pdf-output data-pdf-path="01_Core_Plan/Offer_Presentation_Slides.pdf"><OfferPresentationPdf playbook={playbook} /></div>

                {/* 02 Money Models */}
                <div data-pdf-output data-pdf-path="02_Money_Models/Your_Money_Making_Plan.pdf"><CfaModelPdf moneyModel={playbook.moneyModel} /></div>
                
                {/* 03 Marketing Materials */}
                <div data-pdf-output data-pdf-path="03_Marketing_Materials/High-Converting_Landing_Page.pdf"><LandingPagePdf playbook={playbook} businessData={businessData} /></div>
                <div data-pdf-output data-pdf-path="03_Marketing_Materials/Simple_Offer_Flyer.pdf"><DownsellPamphletPdf downsell={playbook.downsell} /></div>
                <div data-pdf-output data-pdf-path="03_Marketing_Materials/Customer_Follow-Up_Note.pdf"><TripwireFollowupPdf downsell={playbook.downsell} gso={playbook.offer1} /></div>

                {/* 04 Asset Library - Offer 1 */}
                <div data-pdf-output data-pdf-path={`04_Asset_Library/${sanitizeName(playbook.offer1.name)}/00_Full_Asset_Bundle.pdf`}><ValueStackAssetsPdf offer={playbook.offer1} /></div>
                {playbook.offer1.stack.map(item => item.asset && (
                     <div key={`o1-${item.asset.name}`} data-pdf-output data-pdf-path={`04_Asset_Library/${sanitizeName(playbook.offer1.name)}/${sanitizeName(item.asset.type)}_${sanitizeName(item.asset.name)}.pdf`}>
                        <AssetPdf asset={item.asset} />
                     </div>
                ))}
                
                {/* 04 Asset Library - Offer 2 */}
                <div data-pdf-output data-pdf-path={`04_Asset_Library/${sanitizeName(playbook.offer2.name)}/00_Full_Asset_Bundle.pdf`}><ValueStackAssetsPdf offer={playbook.offer2} /></div>
                {playbook.offer2.stack.map(item => item.asset && (
                     <div key={`o2-${item.asset.name}`} data-pdf-output data-pdf-path={`04_Asset_Library/${sanitizeName(playbook.offer2.name)}/${sanitizeName(item.asset.type)}_${sanitizeName(item.asset.name)}.pdf`}>
                        <AssetPdf asset={item.asset} />
                     </div>
                ))}
                 {/* 04 Asset Library - Downsell Offer */}
                <div data-pdf-output data-pdf-path={`04_Asset_Library/${sanitizeName(playbook.downsell.offer.name)}/00_Full_Asset_Bundle.pdf`}><ValueStackAssetsPdf offer={playbook.downsell.offer} /></div>
                {playbook.downsell.offer.stack.map(item => item.asset && (
                     <div key={`ds-${item.asset.name}`} data-pdf-output data-pdf-path={`04_Asset_Library/${sanitizeName(playbook.downsell.offer.name)}/${sanitizeName(item.asset.type)}_${sanitizeName(item.asset.name)}.pdf`}>
                        <AssetPdf asset={item.asset} />
                     </div>
                ))}
            </div>
        );
    }
    
    if (assetBundle) {
        return <ValueStackAssetsPdf offer={assetBundle} />;
    }
    if (singleAsset) {
        return <AssetPdf asset={singleAsset} />;
    }

    switch (type) {
        case 'full': return <FullPlaybookPdf playbook={playbook} />;
        case 'concepts-guide': return <ConceptsGuidePdf playbook={playbook} businessData={businessData} />;
        case 'kpi-dashboard': return <KpiDashboardPdf kpiDashboard={playbook.kpiDashboard} />;
        case 'accountability-tracker': return <AccountabilityTrackerPdf tracker={playbook.accountabilityTracker} />;
        case 'landing-page': return <LandingPagePdf playbook={playbook} businessData={businessData} />;
        case 'offer-presentation': return <OfferPresentationPdf playbook={playbook} />;
        case 'downsell-pamphlet': return <DownsellPamphletPdf downsell={playbook.downsell} />;
        case 'tripwire-followup': return <TripwireFollowupPdf downsell={playbook.downsell} gso={playbook.offer1} />;
        case 'cfa-model': return <CfaModelPdf moneyModel={playbook.moneyModel} />;
        case 'mini-clarity-report': return <MiniClarityReportPdf playbook={playbook} businessData={businessData} />;
        default: return null;
    }
};

export default AllPdfs;
