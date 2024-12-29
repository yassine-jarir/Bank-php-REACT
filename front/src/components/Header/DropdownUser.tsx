 import { Link } from 'react-router-dom';
 import logo from "../../images/bank.png"
const DropdownUser = () => {
 
  return (
     
      <Link
        
        className="flex items-center gap-4"
        to="#"
      >
      

        <span className="h-12 w-12 rounded-full">
          <img src={logo} alt="User" />
        </span>

      
      </Link>

  
   );
};

export default DropdownUser;
