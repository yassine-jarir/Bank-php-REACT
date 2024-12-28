import axios from "axios";
import { useEffect, useState } from "react";

interface Account {
  id: number;
  holder_name: string;
  balance: number;
  account_number: string;
  overdraft_limit?: number; 
  account_type: string;
}

function CurrentAccount() {
  const [accounts, setAccounts] = useState<Account[]>([]);  
  const [error, setError] = useState<string | null>(null);  
console.log(error)
  // const fetchAccount = 
  const fetchAccount = () => {
    axios("http://localhost:8080/?action=getAccounts&account_type=current")
     .then((response) => {
       
       if (response.data && Array.isArray(response.data)) {
         setAccounts(response.data as Account[]);  
       } else {
         setError("Invalid data format"); 
       }
       console.log(response)
     })
     .catch((err) => {
       setError("Failed to fetch data"); 
       console.error(err);
     });
    
  }
  
useEffect(() => {
  fetchAccount();
},[]
)
  const handleDelete = (id : number) => {
    axios.delete(`http://localhost:8080/?action=deleteAccount&account_id=${id}`)
    
    .then((response) => {
      fetchAccount()
     setAccounts((prevAccount) => {
       return prevAccount.filter(item => item.id != id);
     })
     
     console.log("deleted succuffuly",response)
     })
    .catch((err) => {
      setError("Failed DELETE"); 
      console.error(err);
    });
  }
  
  return (
    <div className="relative overflow-x-auto h-full w-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Nom et Prénom</th>
            <th scope="col" className="px-6 py-3">Solde</th>
            <th scope="col" className="px-6 py-3">Numéro de Compte</th>
            <th scope="col" className="px-6 py-3">limite de découvert</th>
            <th scope="col" className="px-6 py-3">Type de Compte</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
 
          {accounts.map((account) => (
            <tr
              key={account.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {account.holder_name}
              </th>
              <td className="px-6 py-4">{account.balance}€</td>
              <td className="px-6 py-4">{account.account_number}</td>
              <td className="px-6 py-4">
                {account.overdraft_limit ? `${account.overdraft_limit}%` : "N/A"}
              </td>
              <td className="px-6 py-4">{account.account_type}</td>
              <td className="px-6 py-4 flex space-x-2">
                <button className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2">
                  Mettre à jour
                </button>
                <button onClick={()=>handleDelete(account.id)} className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CurrentAccount;