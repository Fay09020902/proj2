import SendInviteForm from './SendInviteForm';
import InviteHistory from './InviteHistory';
import { useState } from 'react';

const HiringManagement = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div>
      <h2>Send Registration Invitation</h2>
      <SendInviteForm setRefreshTrigger={setRefreshTrigger}/>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Invite History</h2>
      <InviteHistory  refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default HiringManagement;
