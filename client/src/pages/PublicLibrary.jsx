import React from "react";
import { useEffect, useState } from "react";
import '../style/shelf.css'
import { useStateValue } from '../context/StateProvider'
const baseUrl = "http://localhost:4000/";

function PublicLibrary() {
  const [books, setBooks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [{ user }, dispatch] = useStateValue()

  const getBooks = async () => {
    if (user != null || user != undefined) {
      try {
        console.log(user.user.email, "user")
        if (loading) {
          const response = await fetch(`${baseUrl}api/mongi/getLibrary/${user.user.email}`)
          const data = await response.json()
          for (let i = 0; i < data.audio.length; i++) {
            data.audio[i].summary = false
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
        newBooks.audio[i].summary = !newBooks.audio[i].summary
      }
    }
    console.log(books,"Books")
    setBooks(newBooks)
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
      {/* <div class="bg-gray-200 p-8">
  <div class="flex flex-wrap -mx-4">
    <div class="w-1/3 px-4">
      <div class="relative rounded-lg shadow-md">
        <div class="absolute inset-0 bg-white opacity-75"></div>
        <img class="w-full h-full object-cover rounded-lg" src="https://picsum.photos/id/1018/400/400" alt="Book cover"/>
        <div class="absolute inset-0 px-6 py-4">
          <h3 class="text-lg font-semibold text-gray-800">Book title</h3>
          <p class="mt-2 text-sm text-gray-600">Author name</p>
        </div>
      </div>
    </div>
    <div class="w-1/3 px-4">
      <div class="relative rounded-lg shadow-md">
        <div class="absolute inset-0 bg-white opacity-75"></div>
        <img class="w-full h-full object-cover rounded-lg" src="https://picsum.photos/id/102/400/400" alt="Book cover"/>
        <div class="absolute inset-0 px-6 py-4">
          <h3 class="text-lg font-semibold text-gray-800">Book title</h3>
          <p class="mt-2 text-sm text-gray-600">Author name</p>
        </div>
      </div>
    </div>
    <div class="w-1/3 px-4">
      <div class="relative rounded-lg shadow-md">
        <div class="absolute inset-0 bg-white opacity-75"></div>
        <img class="w-full h-full object-cover rounded-lg" src="https://picsum.photos/id/103/400/400" alt="Book cover"/>
        <div class="absolute inset-0 px-6 py-4">
          <h3 class="text-lg font-semibold text-gray-800">Book title</h3>
          <p class="mt-2 text-sm text-gray-600">Author name</p>
        </div>
      </div>
    </div>
  </div>
</div> */}
      {/*https://picsum.photos/id/1018/400/400*/}
      <div class="bookshelf bg-gray-300 p-4 rounded-lg">
        <div class="grid grid-cols-2 items-center justify-center gap-y-32">
          {loading == true ? <h1>Loading...</h1> :
            <>
              {books.audio.map((brok) => {
                return (
                  // <div key={brok._id} class="book relative w-48 h-64 rounded-lg shadow-md transform perspective(1000px) hover:rotate-y-180 transition duration-500">
                  //   <div class="front absolute top-0 left-0 w-full h-full rounded-lg origin-left transform rotate-y-0 transition duration-500" style={{ backgroundImage: `url(${brok.image})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>
                  //     {/* <img src={`${brok.image}`} alt="Book Cover" class="w-full h-full rounded-t-lg"/> */}
                  //     <div class="book-info p-4">
                  //       <h3 class="text-lg font-semibold">{brok.file_name}</h3>
                  //       <p class="text-sm">{brok.author_email}</p>
                  //     </div>
                  //   </div>
                  //   <div class="back absolute top-0 left-0 w-full h-full bg-white rounded-lg transform rotate-y-180 transition duration-500">
                  //     {/* <img src={`${brok.image}`} alt="Book Back" class="w-full h-full rounded-t-lg"/> */}
                  //   </div>
                  // </div>
                  <div key={brok._id} onClick={() => { flipLogic(brok._id) }} className='ml-[50%] w-[21rem] h-[30rem] relative flex items-center hover:cursor-pointer'>
                <div className={`${!brok.summary ? 'absolute z-30 w-[21rem] h-[30rem] rounded-r-3xl transition-all duration-30000 origin-left' : 'absolute z-20 w-[21rem] h-[30rem] rounded-r-3xl transition-all duration-30000 rotate-y-180 origin-left'}`} >
                  <img src={`${brok.image}`} className='w-full h-full rounded-r-3xl' alt='book-cover' />
                </div>
                <div className={`${!brok.summary ? 'p-2 absolute z-20 w-80 h-[28rem] bg-white rounded-l-3xl' : 'p-2 absolute z-40 w-80 h-[28rem] bg-white rounded-l-3xl -translate-x-full transition-all duration-30000 border-r-2 shadow-xl border-r-gray-500'}`}>
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
              </div>
                )
              })}
            </>
          }

          {/* <div class="book relative w-48 h-64 bg-white rounded-lg shadow-md transform perspective(1000px) hover:rotate-y-180 transition duration-500">
      <div class="front absolute top-0 left-0 w-full h-full bg-white rounded-lg transform rotate-y-0 transition duration-500">
      <img src="/book_cover/Fourth.jpg" alt="Book Cover" class="w-full h-full rounded-t-lg"/>
        <div class="book-info p-4">
          <h3 class="text-lg font-semibold">Book Title</h3>
          <p class="text-sm">Author Name</p>
        </div>
      </div>
      <div class="back absolute top-0 left-0 w-full h-full bg-white rounded-lg transform rotate-y-180 transition duration-500">
        <img src="/book_cover/First.jpg" alt="Book Back" class="w-full h-full rounded-t-lg"/>
      </div>
    </div>
    <div class="book relative w-48 h-64 bg-white rounded-lg shadow-md hover:rotate-y-180 transition duration-500">
      <div class="front absolute top-0 left-0 w-full h-full transform rotate-y-0 transition duration-500">
        <img src="https://picsum.photos/id/102/400/400" alt="Book Cover" class="w-full h-full rounded-t-lg"/>
        <div class="book-info p-4">
          <h3 class="text-lg font-semibold">Book Title</h3>
          <p class="text-sm">Author Name</p>
        </div>
      </div>
      <div class="back absolute top-0 left-0 w-full h-full transform rotate-y-180 transition duration-500">
        <img src="book-back.jpg" alt="Book Back" class="w-full h-full rounded-t-lg"/>
      </div>
    </div>
    <div class="book relative w-48 h-64 bg-white rounded-lg shadow-md hover:rotate-y-180 transition duration-500">
      <div class="front absolute top-0 left-0 w-full h-full transform rotate-y-0 transition duration-500">
        <img src="https://picsum.photos/id/103/400/400" alt="Book Cover" class="w-full h-full rounded-t-lg"/>
        <div class="book-info p-4">
          <h3 class="text-lg font-semibold">Book Title</h3>
          <p class="text-sm">Author Name</p>
        </div>
      </div>
      <div class="back absolute top-0 left-0 w-full h-full transform rotate-y-180 transition duration-500">
        <img src="book-back.jpg" alt="Book Back" class="w-full h-full rounded-t-lg"/>
      </div>
    </div> */}
          {/* <div class="book bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <img src="https://picsum.photos/id/103/400/400" alt="Book Cover" class="w-full rounded-t-lg"/>
      <div class="book-info p-4">
        <h3 class="text-lg font-semibold">Book Title</h3>
        <p class="text-sm">Author Name</p>
      </div>
    </div> */}
        </div>
      </div>

    </>
  )
}
//     <div className="main">
//       <div className="library">
//       <div className="shelf">
//         <div className=" container">

//           <div className="card">
//             <div className="card_front" />
//             <div className="card_back">
//               <div className="card-text">
//                 <p>
//                   When mysterious letters start arriving on his doorstep, Harry
//                   Potter has never heard of Hogwarts School of Witchcraft and
//                   Wizardry. They are swiftly confiscated by his aunt and uncle.
//                   Then, on Harry's eleventh birthday, a strange man bursts in
//                   with some important news: Harry Potter is a wizard and has
//                   been awarded a place to study at Hogwarts. And so the first of
//                   the Harry Potter adventures is set to begin.
//                 </p>
//               </div>
//             </div>
//         </div>
//         </div>
//         <div className="container" ontouchstart="this.classList.toggle('hover');">
//         <div className="card">
//           <div className="card_front" />
//           <div className="card_back">
//             <div className="card-text">
//               <p>
//                 When mysterious letters start arriving on his doorstep, Harry
//                 Potter has never heard of Hogwarts School of Witchcraft and
//                 Wizardry. They are swiftly confiscated by his aunt and uncle.
//                 Then, on Harry’s eleventh birthday, a strange man bursts in
//                 with some important news: Harry Potter is a wizard and has
//                 been awarded a place to study at Hogwarts. And so the first of
//                 the Harry Potter adventures is set to begin.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="container" ontouchstart="this.classList.toggle('hover');">
//         <div className="card">
//           <div className="card_front" />
//           <div className="card_back">
//             <div className="card-text">
//               <p>
//                 When mysterious letters start arriving on his doorstep, Harry
//                 Potter has never heard of Hogwarts School of Witchcraft and
//                 Wizardry. They are swiftly confiscated by his aunt and uncle.
//                 Then, on Harry’s eleventh birthday, a strange man bursts in
//                 with some important news: Harry Potter is a wizard and has
//                 been awarded a place to study at Hogwarts. And so the first of
//                 the Harry Potter adventures is set to begin.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>


//     <div className="shelf">
//       <div className="container" ontouchstart="this.classList.toggle('hover');">
//         <div className="card">
//           <div className="card_front" />
//           <div className="card_back">
//             <div className="card-text">
//               <p>
//                 When mysterious letters start arriving on his doorstep, Harry
//                 Potter has never heard of Hogwarts School of Witchcraft and
//                 Wizardry. They are swiftly confiscated by his aunt and uncle.
//                 Then, on Harry’s eleventh birthday, a strange man bursts in
//                 with some important news: Harry Potter is a wizard and has
//                 been awarded a place to study at Hogwarts. And so the first of
//                 the Harry Potter adventures is set to begin.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="container" ontouchstart="this.classList.toggle('hover');">
//         <div className="card">
//           <div className="card_front" />
//           <div className="card_back">
//             <div className="card-text">
//               <p>
//                 When mysterious letters start arriving on his doorstep, Harry
//                 Potter has never heard of Hogwarts School of Witchcraft and
//                 Wizardry. They are swiftly confiscated by his aunt and uncle.
//                 Then, on Harry’s eleventh birthday, a strange man bursts in
//                 with some important news: Harry Potter is a wizard and has
//                 been awarded a place to study at Hogwarts. And so the first of
//                 the Harry Potter adventures is set to begin.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="container" ontouchstart="this.classList.toggle('hover');">
//         <div className="card">
//           <div className="card_front" />
//           <div className="card_back">
//             <div className="card-text">
//               <p>
//                 When mysterious letters start arriving on his doorstep, Harry
//                 Potter has never heard of Hogwarts School of Witchcraft and
//                 Wizardry. They are swiftly confiscated by his aunt and uncle.
//                 Then, on Harry’s eleventh birthday, a strange man bursts in
//                 with some important news: Harry Potter is a wizard and has
//                 been awarded a place to study at Hogwarts. And so the first of
//                 the Harry Potter adventures is set to begin.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
// </div>
//       </div>
//       </div>


export default PublicLibrary;
