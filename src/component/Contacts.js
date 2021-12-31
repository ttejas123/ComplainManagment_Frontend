import ContactForm from "./ContactForm.js";
import ImageGallery from "./ImageGallary.js";
import React, {useState, useEffect} from "react";
import { Card, CardHeader, CardTitle, CardBody, FormGroup, Label, Input, Row, Col, Modal, ModalHeader, ModalBody, Button, ModalFooter, TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink } from 'reactstrap'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
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

  const toggle = tab => {
    setActive(tab)
  }
	//get data from fireBase DataBase and store in setContactObject
	useEffect(()=>{
		axios.get("http://localhost:3001/read").then((result)=>{
			console.log(result.data);
			setContactObject(
 				result.data
		    )
		})
	},[])

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

	const data = [
		{
			id: 438734583745,
			full_name: "Tejas Vijay Thakare",
			email: "tthakre73@gmail.com",
			age: 36,
			salary: 326472
		},
		{
			id: 346283427783,
			full_name: "Vijay Shamrao Thakare",
			email: "vijaythakare73@gmail.com",
			age: 26,
			salary: 388399
		}
	]

	const basicColumns = [
		  {
		    name: 'ID',
		    selector: '_id',
		    sortable: true,
		    // maxWidth: '100px'
		  },
		  {
		    name: 'Image',
		    selector: 'name',
		    sortable: true,
			    cell: row => (
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
		    selector: 'fullName',
		    sortable: true,
		    // minWidth: '225px'
		  },
		  {
		    name: 'Mobile',
		    selector: 'mobile',
		    sortable: true,
		    // minWidth: '225px'
		  },
		  {
		    name: 'Email',
		    selector: 'email',
		    sortable: true,
		    // minWidth: '310px'
		  },
		  {
		    name: 'Address',
		    selector: 'address',
		    sortable: true,
		    // minWidth: '175px'
		  },
		  {
		  	name: 'Action',
		  	selector: 'AddEdit',
		  	sortable: false,
		  	cell: row => (
		  		<>
			      <a className="btn text-primary" onClick={()=>{setCurrentId(row._id)}}>
							<i className="fas fa-pencil-alt"/>
					  </a>
					  <a className="btn text-danger" onClick={()=>{onDelete(row._id)}}>
							<i className="fas fa-trash-alt"/>
					  </a>
				</>
			    ) 
		  }
		]

	const Datatable = () => {
		return (
					<Card>
					  <CardHeader>
					  	User Table
					  </CardHeader>
				      <DataTable
				        noHeader
				        pagination
				        data={contactObject}
				        columns={basicColumns}
				        className='react-dataTable'
				        sortIcon={<ChevronDown size={10} />}
				        paginationDefaultPage={currentPage + 1}
				       
				        paginationRowsPerPageOptions={[10, 25, 50, 100]}
				      />
				    </Card>
			)
	}
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
				          <Datatable />
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