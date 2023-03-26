import React from 'react'
import '../App.css'
import {useStateValue} from '../context/StateProvider'
import empty from '../images/empty.png'

function UserProfile() {
  
  const [{ user }, dispatch] = useStateValue();
  console.log(user, "user");

  const items = true
  
  return (
    <div className="mx-44 my-7  ">

    {user ? <div className="flex  ">
    <div className="w-4/12 p-10 flex flex-col text-white items-center orange text-2xl">
      <img src={user.user.imageURL} className="h-56 w-56 mb-4 rounded-full" alt="profile"  />
      <h1 className="text-xl py-1">{user.user.name}</h1>
      <h1 className='text-xl '>{user.user.email}</h1>
    </div>
    <div className="w-full px-10 ">

      {items  ? <img src={empty} alt="empty" className="" /> :  <h1 className='text-4xl  mb-10'>saved items: 0</h1>
}
    </div>
  </div>: <h1>loading</h1>}
  </div>
    
  )
}

export default UserProfile