import React, { Component, useState, useEffect } from 'react';
import Card from './card';
import axios from 'axios';
import { baseUrl } from '../AllUrls.js'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

const images = [
  '//placekitten.com/1500/500',
  '//placekitten.com/4000/3000',
  '//placekitten.com/800/1200',
  '//placekitten.com/1500/1500',
  '//placekitten.com/1500/510',
  '//placekitten.com/4000/3000',
  '//placekitten.com/800/1200',
  '//placekitten.com/1500/1500',
  '//placekitten.com/1500/500',
  '//placekitten.com/4000/3000',
  '//placekitten.com/800/1200',
  '//placekitten.com/1500/1500',
  '//placekitten.com/1500/510',
  '//placekitten.com/4000/3000',
  '//placekitten.com/800/1200',
  '//placekitten.com/1500/1500',
];

const ImageGallery = () => {
    const [contactObject, setContactObject] = useState([]);
    const [centeredModal, setCenteredModal] = useState(false)
    const [modelData, setModeldata] = useState({})
    useEffect(()=>{
        axios.get("http://localhost:3001/images/").then((result)=>{
            console.log(result.data.data);
            setContactObject(
                result.data.data
            )
        })
    },[])

    const ModelOpen = () => {
        return (
            <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered'>
              <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>{modelData.name}</ModalHeader>
              <ModalBody>
                <img className='img-fluid' src={modelData.srcImg} />
              </ModalBody>
            </Modal>
            )
    }
    return (
    	<>
        <ModelOpen />
    	<div className='float-right px-1 mb-2 border'>
    		<img  src="https://img.icons8.com/material-sharp/24/000000/download--v2.png"/> <b>Download Image .CSV</b> 
    	</div>
    	<ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 4}}
            >
            <Masonry>
        {
        	contactObject.map((val, index) => {
        	return(
                <div  onClick={() => {
                                setModeldata({
                                    name: val.name,
                                    srcImg: baseUrl+val.url
                                })
                                setCenteredModal(!centeredModal)
                            }} >
        		  <Card src = {val} />
        		</div>
                )
        	})
        }
        </Masonry>
        </ResponsiveMasonry>
        </>
      );
}

export default ImageGallery;
