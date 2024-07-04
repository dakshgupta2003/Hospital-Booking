import React from 'react'
import { services } from '../../assets/data/services'
// we put {} because from services.jsx we are importing services array not the file
import ServiceCard from './ServiceCard'
import { BsFillPersonBadgeFill } from 'react-icons/bs'

const ServiceList = () => {
  return (
    <>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]'>
        {
            services.map((item,index) => (
                <ServiceCard item={item} index={index} key={index} />
            )) 
        }
    </div>

    </>
  )
}

export default ServiceList