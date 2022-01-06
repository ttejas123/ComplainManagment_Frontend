import React, { Component, useState, useEffect } from 'react';
import Card from './card';
import axios from 'axios';
import {CSVLink} from 'react-csv'
import { baseUrl } from '../AllUrls.js'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

const ImageGallery = () => {
    const [contactObject, setContactObject] = useState([]);
    const [centeredModal, setCenteredModal] = useState(false)
    const [modelData, setModeldata] = useState({})
    const [exportData, setExportData] = useState([{url: "", unv:""}]);
    
    useEffect(()=>{
        axios.get("http://localhost:3001/images/").then((result)=>{
           
            setContactObject(
                result.data.data
            )
        })
    },[])

    const headerssImg = [
        {key: 'url', label: 'For Read Only'},
    ]

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
    		<CSVLink data={contactObject} headers={headerssImg}><img  src="https://img.icons8.com/material-sharp/24/000000/download--v2.png"/> <b>Download Image .CSV</b></CSVLink> 
    	</div>
    	<ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 4}}
            >
            <Masonry>
        {
        	contactObject.map((val, index) => {
        	return(
                <div key={index} onClick={() => {
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
