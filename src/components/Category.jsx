import { faPen, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import VideoCard from './VideoCard'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { addCategoryApi, getFromCategoryApi,deleteCategoryApi ,AvideoApi,updateCategoryApi} from '../services/allApi';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';


function Category({dragStatus,setDragStatus}) {
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState("")
  const [allCategory,setAllCategory] = useState([])
 const [addStatus,setAddStatus] = useState(false)

//  ...............
  //const [deleteCategory,setdeleteCategory] = useState([])
  //................

  const handleClose = () => {setShow(false)
    setCategoryName("")
  };


  const handleShow = () => setShow(true);
  const addCategory = async()=>{
  if(categoryName){
    const reqBody={
      categoryName,
      allVideo:[]
    }
    const result = await addCategoryApi(reqBody)
    if(result.status>=200 && result.status<300){
      setAddStatus(true)
      handleClose()
      toast.success('Category added succefully')
      }

    else{
      console.log(result);
    }
  }
  else{
    toast.info('Please add the category name')
  }
  }

  const getAllCategory =async()=>{
    const result = await getFromCategoryApi()
    console.log(result);
   if(result.status>=200 && result.status<300){
      setAllCategory(result.data)
      
    }
    
  }
  console.log(allCategory);

  const delCategory = async(id)=>{
    const result =  await deleteCategoryApi(id)
    console.log(result);
    getAllCategory()
  }


  const DragOver=(e)=>{
    e.preventDefault()
  }

  const VideoDrop =async(e,categoryId)=>{
     console.log(`category id is ${categoryId}`);
     //accessing video id from view component
     const videoId =e.dataTransfer.getData("videoId")
     console.log("video id is ",videoId);
     //get the video details from backend
     const {data} = await AvideoApi(videoId)
     console.log(data);
     const selectedCategory = allCategory.find((item)=>item.id==categoryId)
     
    if(selectedCategory.allVideo.find((item)=>item.id==data.id)){
     toast.warning('Video already exist in category')
    }
    else{
      selectedCategory.allVideo.push(data)
      await updateCategoryApi(categoryId,selectedCategory)
      getAllCategory()
    }
  }

  const DragStart = (e,videoId,categoryId)=>{
    console.log(videoId);
    console.log(categoryId);
    let dataShare={videoId,categoryId}
    e.dataTransfer.setData("dataShared",JSON.stringify(dataShare))
  }

  useEffect(()=>{
    setAddStatus(false)
    getAllCategory()
    setDragStatus(false)
  },[addStatus,dragStatus])

 
 
   
  return (
    <>
    <div className='w-100 mt-md -1 mt-5 p-4'>
      
      <button className='btn btn-warning w-100' onClick={handleShow}> <span className='me-1'> Add new category</span><FontAwesomeIcon icon={faPlus} /></button>
    </div>


    {allCategory?.length>0?
    allCategory?.map((item)=>(
      <div className="mt-md-5 mt-2" droppable onDragOver={(e)=>DragOver(e)} onDrop={(e)=>VideoDrop(e,item.id)}>
      <div className='border border-secondary mt-3 p-3 rounded ms-4 ms-md-0' >
        <div className="d-flex">
          <h6>{item.categoryName}</h6>
          <button className='btn btn-danger ms-auto ' onClick={()=>delCategory(item.id)} ><FontAwesomeIcon icon={faTrashCan} /></button>
        </div>
         <Row>
          {item?.allVideo?.length>0?
            item?.allVideo?.map((videoItem)=>(<Col sm={12} draggable onDragStart={(e)=>DragStart(e,videoItem.id,item.id)}>
          <VideoCard displayVideo={videoItem} isPresent={true}/>
          </Col>))
          :
          null
          }
         </Row>
      </div>
    </div>
    ))
     
    :
    null
    }
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title  className='text-warning'><FontAwesomeIcon icon={faPen} /><span style={{color:'white'}}>Add new category</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className='border rounded p-3 border-secondary'>
            <p>Category name</p>
            <input type="text" placeholder='Category Name' className='form-control' onChange={(e)=>setCategoryName(e.target.value)}/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="warning" onClick={addCategory}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Category