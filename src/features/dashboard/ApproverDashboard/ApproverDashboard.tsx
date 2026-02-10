import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/common/PageLayout';
import { ComingSoonState } from '@/components/common/StateMessage';
import {
  type ApproverDashboardType,
  approverDashboardTypeToStatuses,
  approverSidebarItems,
} from './utils/types';

export function ApproverDashboard() {
  const { view = 'all' } = useParams<{ view: ApproverDashboardType }>();
  const activeView = view in approverDashboardTypeToStatuses ? view : 'all';

  return (
    <PageLayout sidebarItems={approverSidebarItems} activeKey={activeView}>
      <ComingSoonState />
    </PageLayout>
  );
}
