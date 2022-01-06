import ContactForm from "./ContactForm.js";
import ImageGallery from "./ImageGallary.js";
import {CSVLink} from 'react-csv'
import React, {useState, useEffect, forwardRef} from "react";
import { Card, CardHeader, CardTitle, CardBody, FormGroup, Label, Input, Row, Col, Modal, ModalHeader, ModalBody, Button, ModalFooter, TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink } from 'reactstrap'
import ReactPaginate from 'react-paginate'
import { ChevronDown, Download, Trash2, Edit } from 'react-feather'
import DataTable from 'react-data-table-component'
import axios from 'axios';
import Avatar from 'react-avatar';
import { baseUrl } from '../AllUrls.js'

const Contact=()=>{
	const [contactObject, setContactObject] = useState([]);
	const [currentId, setCurrentId] = useState("");
	const [centeredModal, setCenteredModal] = useState(false)
	const [currentPage, setCurrentPage] = useState(0)
	const [modelData, setModeldata] = useState({})
	const [active, setActive] = useState('1')
	const [gg, setgg] = useState([])
	let Data = []
  const toggle = tab => {
    setActive(tab)
  }

  const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => {
      return (
        <div className="custom-control custom-checkbox">
          <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
          <label className='custom-control-label' onClick={onClick} />
        </div>
      )
    }
  )
	//get data from mongo DataBase and store in setContactObject
	useEffect(()=>{
		axios.get("http://localhost:3001/read").then((result)=>{
			console.log(result.data);
			setContactObject(
 				result.data
		    )
		})
	},[setCurrentId])

	//Store data into firebase, or update data into database
	const addOrEdit = (obj) =>{
		if(currentId==""){
			console.log("This is for Update Data");
			axios.post('http://localhost:3001/insert', obj)
		    setCurrentId("")
		}else{
			console.log("we are going in right direction");
			axios.post('http://localhost:3001/update', obj)
		    setCurrentId("")
		}
	}
	const onDelete=(id)=>{
		console.log(id);
		axios.post('http://localhost:3001/delete',{
		      deleteId: id,
		  })
		window.location.reload();
	}
const headerss = [
  
    // Title of the columns (column_names)
    {key: '_id', label: '_id'},
    {key: 'url', label: 'url'},
    {key: 'fullName', label: 'fullName'},
    {key: 'mobile', label: 'mobile'},
    {key: 'email', label: 'email'},
    {key: 'address', label: 'address'}
  ]

const headerssImg = [
    {key: 'url', label: 'Image'}
 ]

	const basicColumns = [
		  {
		    name: 'ID',
		    selector: row => row._id,
		    sortable: true,
		    // maxWidth: '100px'
		  },
		  {
		    name: 'Image',
		    sortable: true,
			    selector: row => (
			      <div className='d-flex align-items-center'>
			        {row.url == '' ? (
			           <div className='vertically-centered-modal'>
			           		<Button color='primary' outline onClick={() => setCenteredModal(!centeredModal)}>
          Launch Modal
        </Button>
			           		<Button >
			           			<Avatar size="40" round="20px" facebook-id="invalidfacebookusername" src={baseUrl+row.url} />
					        </Button>
					        
					      </div>
			        ) : (
			        	<div className="cursor-pointer">
			          		<Avatar  onClick={() => {
			          			setModeldata({
			          				name: row.ImgName,
			          				srcImg: baseUrl+row.url
			          			})
			          			setCenteredModal(!centeredModal)
			          		}} size="40" round="20px" facebook-id="invalidfacebookusername" src={baseUrl+row.url} />
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
		  },
		  {
		  	name: 'Action',
		  	sortable: false,
		  	selector: row => (
		  		<>
			      <a className="btn px-1" onClick={()=>{setCurrentId(row._id)}}>
							<Edit size='15' color='black' />
					  </a>
					  <a className="btn px-1" onClick={()=>{onDelete(row._id)}}>
							<Trash2 size='15' color='red'/>
					  </a>
				</>
			    ) 
		  }
		]

	  return (
	  	<div >
		  	<div className="jumbotron jumbotron-fluid py-5">
			  <div className="container">
			    <h1 className="display-6 text-center">User Curd</h1>
			  </div>
			</div>

				<Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered'>
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>{modelData.name}</ModalHeader>
          <ModalBody>
            <img className='img-fluid' src={modelData.srcImg} />
          </ModalBody>
        </Modal>

			<div className="row">
				<div className="col-md-5">
					<ContactForm {...({addOrEdit, currentId, contactObject, setCurrentId})} />
				</div>
				<div className="col-md-7">
					<Nav pills className="mb-2">
				        <NavItem>
				          <NavLink
				            active={active === '1'}
				            onClick={() => {
				              toggle('1')
				            }}
				          >
				            Data Table
				          </NavLink>
				        </NavItem>
				        <NavItem>
				          <NavLink
				            active={active === '2'}
				            onClick={() => {
				              toggle('2')
				            }}
				          >
				            Image Gallery
				          </NavLink>
				        </NavItem>
				      </Nav>
				      <TabContent className='py-50' activeTab={active}>
				        <TabPane tabId='1'>
				          <Card>
									  <CardHeader className='d-flex justify-content-between'>
									  	<div>User Table</div> <div>{gg.length > 0 ? (<div className="d-flex justify-content-center align-items-center">
												<div className='ml-3' ><Download size='15' /><CSVLink className='ml-1' data={gg} headers={headerssImg}>IMG</CSVLink></div>
												<div className='ml-3'><Download size='15' /><CSVLink className="ml-1" data={gg} headers={headerss}>Export All</CSVLink></div>
												<div className='ml-5'><Trash2 onClick={()=>{
									  		const NewData = gg.map((val) => {
																		return val._id
																	})
	
												axios.post('http://localhost:3001/deleteManyById',{
												      deleteManyById: NewData,
												  })
												window.location.reload();
									  	}} color='red' size='15' /></div>
									  	</div>) : (<></>)}</div>
									  </CardHeader>
								      <DataTable
								        noHeader
								        selectableRows
								        pagination
								        striped
								        onSelectedRowsChange = {(e) => {
								        	setgg(e.selectedRows)}}
								        data={contactObject}
								        columns={basicColumns}
								        className='react-dataTable'
								        sortIcon={<ChevronDown size={10} />}
								       	selectableRowsComponent={BootstrapCheckbox}

								        paginationRowsPerPageOptions={[10, 25, 50, 100]}
								      />
								    </Card>
				        </TabPane>
				        <TabPane tabId='2'>
				          <ImageGallery />
				        </TabPane>
				      </TabContent>
				</div>
			</div>
		</div>
	  	);
}

export default Contact;