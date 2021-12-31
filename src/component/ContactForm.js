import React, {useState, useEffect} from "react";
import { Card, CardHeader, CardTitle, CardBody, FormGroup, Label, Input, Row, Col } from 'reactstrap'
import axios from 'axios';
import Uppy from '@uppy/core'
import { DragDrop } from '@uppy/react'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import { baseUrl } from '../AllUrls.js'

const ContactForm=(props)=>{
	//default empty object
	const initialValues = {
		fullName:"",
		mobile:"",
		email:"",
		address:"",
	}
	const [values, setValues] = useState({});
	const [imgA, setImgA] = useState(null);

	const [previewArr, setPreviewArr] = useState([])
	const [fileArr, setFileArr] = useState([])
	const uppy = new Uppy({
	    meta: { type: 'avatar' },
	    autoProceed: true,
	    totalProgress: 0
	  })

	  uppy.use(thumbnailGenerator)

	  uppy.on('thumbnail:generated', (file, preview) => {
	    // console.log(file.data)
	    const arr = previewArr
	    arr[0] = preview
	    setPreviewArr([...arr])

	    const fileArrs = fileArr
	    fileArrs[0] = file.data
	    setFileArr([...fileArrs])
	  })

	const renderPreview = () => {
     if (previewArr.length) {
     	console.log(previewArr[0])
       return previewArr.map((src, index) => <img key={index} className='rounded mt-2 mb-2 mr-1 w-50' src={src} alt='avatar' />)
     } else {
       return null
     }
    }
	//for set value to passing to contact.js

	useEffect(()=>{
		if(props.currentId==""){
			setValues({
				...initialValues
			})
		}else{
			//if we get props.currentId mean this is update opration and now we setValue to pass to the Cntact.js  readOne/61c829cbee60ac2b1892e87f
			axios.patch(`http://localhost:3001/readOne/${props.currentId}`).then((result)=>{
				
				setValues({
					...result.data
				})
				setPreviewArr([`${baseUrl}${result.data.url}`])
			})
			console.log(values)
			
		}
	},[props.currentId, props.contactObject]);
	const handleInputeChange = (event)=>{
	    const { name, value } = event.target;
		setValues({
			...values,
			[name] : value,
		})
	}
	//after submiting form this data pass to contact.js to save or update data.
	const handleFormSubmit = (e)=>{
		// e.preventDefault()
		// console.log(values)
		if(previewArr[0].includes(baseUrl)){
			// updateWOImg
			axios.post('http://localhost:3001/updateWOImg', values)
		  props.setCurrentId("")
		  setValues(initialValues);
		} else if(values) {
			// console.log("gg")
			const data = new FormData()
			data.append('_id', values._id) 
	    data.append('photoimg', fileArr[0])
	   	data.append('fullName', values.fullName)
	   	data.append('mobile', values.mobile)
	   	data.append('email', values.email)
	   	data.append('address', values.address)
			props.addOrEdit(data);
			setValues(initialValues);
		}
	}

	  return (
	  	<>
	  	<form autoComplete="off" onSubmit={handleFormSubmit}>
	  		<div className ="form-group input-group">
	  			<div className="input-group-prepend">
	  				<div className="input-group-text">
	  					<i className="fas fa-user"></i>
	  				</div>
	  			</div>
	  			<input className="form-control"
		  			 placeholder="fullName"
		  			 name="fullName"
		  			 value={values.fullName}
		  			 onChange={handleInputeChange} />
	  		</div>
	  		<div className="form-row">
	  			<div className ="form-group input-group col-md-6">
		  			<div className="input-group-prepend">
		  				<div className="input-group-text">
		  					<i className="fas fa-mobile-alt"></i>
		  				</div>
		  			</div>
		  			<input className="form-control"
			  			 placeholder="mobile No."
			  			 name="mobile"
			  			 value={values.mobile}
			  			 onChange={handleInputeChange} />
	  			</div>
	  			<div className ="form-group input-group col-md-6">
		  			<div className="input-group-prepend">
		  				<div className="input-group-text">
		  					<i className="fas fa-envelope"></i>
		  				</div>
		  			</div>
		  			<input className="form-control"
			  			 placeholder="email"
			  			 name="email"
			  			 value={values.email}
			  			 onChange={handleInputeChange} />
	  			</div>
	  		</div>
	  		<div className="form-group">
	  				<textarea className="form-control" placeholder="address" name="address"
	  				     value={values.address}
			  			 onChange={handleInputeChange} />
	  		</div>
	
          	<div>
          		<div className='border'>
            		<DragDrop uppy={uppy} />
     					</div>
     					{renderPreview()}
          	</div>          
			      
	  		<div className="form-group">
	  			<input type="submit" value ="Save" className="btn btn-primary btn-block"/>
	  		</div>
	  	</form>
	  	</>
	  	);
}

export default ContactForm;