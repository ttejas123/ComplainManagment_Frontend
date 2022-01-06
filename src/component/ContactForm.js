import React, {useState, useEffect} from "react";
import { Card, CardHeader, CardTitle, CardBody, FormGroup, Label, Input, Row, Col, Button } from 'reactstrap'
import Avatar from 'react-avatar';
import csvToJson from 'convert-csv-to-json';
import { ChevronDown } from 'react-feather'
import axios from 'axios';
import Uppy from '@uppy/core'
import { DragDrop } from '@uppy/react'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import '@uppy/core/dist/style.css'
import DataTable from 'react-data-table-component'
import '@uppy/dashboard/dist/style.css'
import { baseUrl } from '../AllUrls.js'
import './contact.css'
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
	const [CsvFile, setCsvFile] = useState(null);
	const [PreCsvFile, setPreCsvFile] = useState(null);
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

		const uppy1 = new Uppy({
	    meta: { type: 'avatar' },
	    autoProceed: true,
	    totalProgress: 0
	  })

	  uppy1.use(thumbnailGenerator)

	  uppy1.on('thumbnail:generated', (file, preview) => {
	  	// setPreCsvFile(preview)
	  	console.log(file)
	    setCsvFile(file.data)
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
			
		}
	},[props.currentId, props.contactObject]);
	const handleInputeChange = (event)=>{
	    const { name, value } = event.target;
		setValues({
			...values,
			[name] : value,
		})
	}

	// const jsonData = [
	// 	{
	// 		Name: "Tejas Thakare",
	// 		url : "https://localhost:3001/21"
	// 	},
	// 	{
	// 		Name: "Khushboo Yadav",
	// 		url : "https://localhost:3001/92"
	// 	}
	// ]

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


	const DataTableAfterSelect = () => {
		const basicColumns = [
		  {
		    name: 'ID',
		    selector: row => row._id,
		    sortable: true
		  },
		  {
		    name: 'Image',
		    sortable: true,
			    selector: row => (
			      <div className='d-flex align-items-center'>
			        {row.url == '' ? (
			           <div className='vertically-centered-modal'>
			           		
			           		<Button >
			           			<Avatar size="40" round="20px" facebook-id="invalidfacebookusername" src={baseUrl+row.url} />
					        	</Button>
					        
					      </div>
			        ) : (
			        	<div className="cursor-pointer">
			          		<Avatar size="40" round="20px" facebook-id="invalidfacebookusername" src={baseUrl+row.url} />
			        	</div>
			        )}
			      </div>
			    )
		    // minWidth: '100px'
		  },
		  {
		    name: 'Name',
		    selector: row => row.fullName,
		    sortable: true,
		    // minWidth: '225px'
		  },
		  {
		    name: 'Mobile',
		    selector: row => row.mobile,
		    sortable: true,
		    // minWidth: '225px'
		  },
		  {
		    name: 'Email',
		    selector: row => row.email,
		    sortable: true,
		    // minWidth: '310px'
		  },
		  {
		    name: 'Address',
		    selector: row => row.address,
		    sortable: true,
		    // minWidth: '175px'
		  }
		  ]
		return (
					<Card>
									  <CardHeader className='d-flex justify-content-between'>
									  	<div>User Table</div> 
									  </CardHeader>
								      <DataTable
								        noHeader
								        selectableRows
								        pagination
								        striped
								        data={[]}
								        columns={[]}
								        className='react-dataTable'
								        sortIcon={<ChevronDown size={10} />}
								        paginationRowsPerPageOptions={[10, 25, 50, 100]}
								      />
				</Card>
			)
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
	
          <div className='mb-3'>
          		<div className='border'>
            		<DragDrop uppy={uppy} />
     					</div>
     					{renderPreview()}
          </div>          
			      
	  		<div className="form-group mb-3">
	  			<input type="submit" value ="Save" className="btn btn-primary btn-block"/>
	  		</div>
	  	</form>
	  		<div class="mb-4">
            <hr data-content="Import CSV" class="hr-text" />
        </div>
      <div className='mb-3'>
          		 
					    <FormGroup>
              	<Label for='inputFile'>Bulk Upload</Label>
              	<Input type='file' onChange={(e) => {
					    				setPreCsvFile(e.target.files[0])
					        }} id='inputFile' name='fileInpur' />

            	</FormGroup>
     					<div className="form-group mb-3">
				  			<input type="submit" value ="Import" onClick={()=> {
				  					console.log(PreCsvFile)
				  					const data = new FormData() 
								    data.append('csvFile', PreCsvFile)
				  					axios.post(`http://localhost:3001/csvFile`, data)
				  					window.location.reload();
				  			}} className="btn btn-primary btn-block"/>
				  		</div>
      </div>
	  	</>
	  	);
}

export default ContactForm;