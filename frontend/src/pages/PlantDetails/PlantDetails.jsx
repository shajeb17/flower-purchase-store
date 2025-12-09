import Container from '../../components/Shared/Container'
import Heading from '../../components/Shared/Heading'
import Button from '../../components/Shared/Button/Button'
import PurchaseModal from '../../components/Modal/PurchaseModal'
import { use, useContext, useState } from 'react'
import {useLocation } from 'react-router'
import { AuthContext } from '../../providers/AuthContext'
import AuthProvider from '../../providers/AuthProvider'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'

const PlantDetails = () => {
  let [isOpen, setIsOpen] = useState(false)
  let loader=useLocation()
  const {_id,image,name,price,quentity,catagory,description}= loader?.state || {};
  let {user,loading}=useContext(AuthContext)
  let {displayName,photoURL}=user || {}
 if(loading) return <LoadingSpinner></LoadingSpinner>
  

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <Container>
      <div className='mx-auto flex flex-col lg:flex-row justify-between w-full gap-12'>
        {/* Header */}
        <div className='flex flex-col gap-6 flex-1'>
          <div>
            <div className='w-full overflow-hidden rounded-xl'>
              <img
                className='object-cover w-full'
                src={image}
                alt='header image'
              />
            </div>
          </div>
        </div>
        <div className='md:gap-10 flex-1'>
          {/* Plant Info */}
          <Heading
            title={name}
            subtitle={`Category: ${catagory}`}
          />
          <hr className='my-6' />
          <div
            className='
          text-lg font-light text-neutral-500'
          >
            {description}
          </div>
          <hr className='my-6' />

          <div
            className='
                text-xl 
                font-semibold 
                flex 
                flex-row 
                items-center
                gap-2
              '
          >
            <div>Seller: {displayName}</div>

            <img
              className='rounded-full'
              height='30'
              width='30'
              alt='Avatar'
              referrerPolicy='no-referrer'
              src={photoURL}
            />
          </div>
          <hr className='my-6' />
          <div>
            <p
              className='
                gap-4 
                font-light
                text-neutral-500
              '
            >
              Quantity: {quentity} Units Left Only!
            </p>
          </div>
          <hr className='my-6' />
          <div className='flex justify-between'>
            <p className='font-bold text-3xl text-gray-500'>Price: {price}$</p>
            <div>
              <Button onClick={() => setIsOpen(true)} label='Purchase' />
            </div>
          </div>
          <hr className='my-6' />

          <PurchaseModal closeModal={closeModal} isOpen={isOpen} />
        </div>
      </div>
    </Container>
  )
}

export default PlantDetails
