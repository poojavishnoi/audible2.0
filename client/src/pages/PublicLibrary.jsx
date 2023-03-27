import React from "react";
import { useEffect, useState } from "react";
import '../style/shelf.css'
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useLocation } from "react-router";
import { useStateValue } from '../context/StateProvider'
const baseUrl = "http://localhost:4000/";


function PublicLibrary() {
  const [books, setBooks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [{ user }, dispatch] = useStateValue()
  const navigate = useNavigate();


  const getBooks = async () => {
    if (user != null || user != undefined) {
      try {
        console.log(user.user.email, "user")
        if (loading) {
          const response = await fetch(`${baseUrl}api/mongi/getPersonalLibrary/${user.user.email}`)
          const data = await response.json()
          for (let i = 0; i < data.audio.length; i++) {
            data.audio[i].summa = false
          }
          setBooks(data)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const flipLogic = (id) => {
    let newBooks = {...books}
    for (let i = 0; i < newBooks.audio.length; i++) {
      if (newBooks.audio[i]._id == id) {
        newBooks.audio[i].summa = !newBooks.audio[i].summa
      }
    }
    console.log(books,"Books")
    setBooks(newBooks)
  }

  const AudioPlay = (id) => {
    navigate("/listen", {
      state: {
        id: id,
      },
    });
  }

  useEffect(() => {
    try {
      if (books == null || books == undefined) {
        setLoading(true)
      }
      getBooks()
    } catch (error) {
      console.log(error)
    }
  }, [user])

  console.log(books, "books")
  console.log(user, "user")
  console.log(loading, "loading")

  return (
    <>
      
      {/*https://picsum.photos/id/1018/400/400*/}
      <div class="bookshelf bg-gray-300 p-4 rounded-lg">
        <div class="grid grid-cols-2 items-center justify-center gap-y-32">
          {loading == true ? <h1>Loading...</h1> :
            <>
              {books.audio.map((brok) => {
                return (
                  <div key={brok._id} onClick={() => { flipLogic(brok._id) }} className='ml-[50%] w-[21rem] h-[30rem] relative flex items-center hover:cursor-pointer'>
                <div className={`${!brok.summa ? 'absolute z-30 w-[21rem] h-[30rem] rounded-r-3xl transition-all duration-30000 origin-left' : 'absolute z-20 w-[21rem] h-[30rem] rounded-r-3xl transition-all duration-30000 rotate-y-180 origin-left'}`} >
                  <img src={`${brok.image}`} className='w-full h-full rounded-r-3xl' alt='book-cover' />
                </div>
                <div className={`${!brok.summa ? 'p-2 absolute z-20 w-80 h-[28rem] bg-white rounded-l-3xl' : 'p-2 absolute z-40 w-80 h-[28rem] bg-white rounded-l-3xl -translate-x-full transition-all duration-30000 border-r-2 shadow-xl border-r-gray-500'}`}>
                  <h1 className='text-lg underline  text-center text-black'>Title</h1>
                  <p className='text-xs text-justify text-black'>
                    Author Book
                  </p>
                  <p className='text-xs text-justify text-black'>
                    Duration
                  </p>
                </div>
                <div className='select-auto p-2 absolute z-20 w-80 h-[28rem] bg-white rounded-r-3xl'>
                  <h1 className='text-lg underline  text-center text-black'>Summary</h1>
                  <p className='text-xs text-justify text-black'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil ipsam consectetur sunt quod. Molestias, maiores sapiente. Unde quaerat, tenetur labore quo consequatur quibusdam repellendus harum ad vitae inventore amet dolore.
                    Adipisci laboriosam est fugiat vero facilis aspernatur maiores, eveniet harum, aliquid inventore quae laborum necessitatibus, veniam cupiditate vitae quaerat nesciunt deserunt repudiandae. Optio, in! Magni eveniet iusto quam veritatis corrupti.
                    Est laudantium perspiciatis, veritatis iure voluptatum libero ipsa, quo eligendi delectus impedit soluta officiis non ab blanditiis! Dolorum, dicta. Numquam voluptates hic recusandae totam sint ipsa inventore consequuntur laboriosam officia.
                    Veniam nihil reprehenderit, fugit impedit ad quae molestiae libero reiciendis sit alias facilis quam provident consectetur accusamus voluptas inventore! Repudiandae saepe alias excepturi, doloremque ipsum doloribus explicabo consequatur reiciendis architecto.
                    Asperiores dignissimos voluptatum dicta sed deleniti, quae accusamus perferendis temporibus voluptatibus neque ea. Natus, dolores error optio doloribus vero aut nam minus rerum quidem praesentium neque enim, odio dolorem impedit!
                  </p>
                </div>
                <div className='absolute z-10 w-[21rem] h-[30rem] bg-blue-300 rounded-r-3xl'><img src={`${brok.image}`} className='w-full h-full rounded-r-3xl' alt='book-cover' /></div>
                <button className='absolute z-20 w-10 h-10 bg-blue-300 rounded-full right-0 top-0 m-2' onClick={()=>{AudioPlay(brok._id)}}>Play</button>
              </div>
                )
              })}
            </>
          }
        </div>
      </div>

    </>
  )
}

export default PublicLibrary;
