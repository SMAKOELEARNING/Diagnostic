import { Outlet } from 'react-router-dom';
import Choix from './Choix';

const ProtectedLayout = () => {
  return (
    <div className="dashboard-container">
      <div className="flex-container" style={{ display: 'flex'}}>
        {/* <div className="choix-content" style={{ position :'fixed'}} > */}
            {/* <Choix /> */}
        {/* </div> */}
        
        <div className="main-content" style={{flex: '1' , width :'85vw', marginLeft: '15vw'}}>
          <Outlet />
        </div>
        
      </div>
    </div>
  );
};

export default ProtectedLayout;
