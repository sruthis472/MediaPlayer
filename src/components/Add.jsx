import { faCloudArrowUp, faFilm } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { addVideoApi } from '../services/allApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Add({setAddStatus}) {
  //create a state to hold data from input
    const [video,setVideo] = useState({
      caption:'',
      image:'',
      url:''
    })
    const [show, setShow] = useState(false);
    const handleClose = () => {
      setShow(false)
      setVideo({ 
          caption:'',
          image:'',
          url:''
        })
    };
    const handleShow = () => setShow(true);

    const validateLink = (e)=>{
      
      const link = e.target.value
      if(link.endsWith('?feature=shared')){
        const ykey = link.slice(-26,-15)
        console.log(ykey);
        let embedLink = `https://www.youtube.com/embed/${ykey}`
        setVideo({...video,url:embedLink})
      }
      else if(link.startsWith('https://youtu.be')){
        const ykey = link.slice(17,28)
        console.log(ykey);
        let embedLink = `https://www.youtube.com/embed/${ykey}`
        setVideo({...video,url:embedLink})
      }
      else if(link.startsWith('https://www.youtube.com/watch?')){
        const ykey = link.slice(32)
        console.log(ykey);
        let embedLink = `https://www.youtube.com/embed/${ykey}`
        setVideo({...video,url:embedLink})
      }
      else{
        const ykey = link.slice(-11)
        console.log(ykey);
        let embedLink = `https://www.youtube.com/embed/${ykey}`
        setVideo({...video,url:embedLink})
      }
    }
  // const handleClose1 =()=>{
  //   setVideo({ caption:'',
  //     image:'',
  //     url:''})
  // }
  const handleUpload = async(e)=>{
    e.preventDefault()
    const {caption , image , url} = video
    if(!caption || !image || !url){
      toast.info('Please fill the form completely')
    }
    else{
      const result=await addVideoApi(video)
      console.log(result);
      if(result.status>=200 && result.status<300){
        toast.success('Video uploaded succefully')
        setAddStatus(result.data)
        handleClose()
      }
      else{
        toast.error('Something went wrong')
        handleClose()
      }
    }

  }
//https://www.youtube.com/embed/tOM-nWPcR4U
//https://youtu.be/tOM-nWPcR4U?si=449hYpQ8fgKzRHSQ
//https://www.youtube.com/watch?v=tOM-nWPcR4U
    console.log(video);
  return (
   <>
   <div className="d-flex a">
    <h5 >Upload <span id='h'>new video</span></h5>
    <button onClick={handleShow} className='btn mb-2'><FontAwesomeIcon  id='t' icon={faCloudArrowUp} size='xl'/></button>
   </div>

   <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='text-warning'><FontAwesomeIcon icon={faFilm} className='me-2'/>Upload Videos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Please fill the following details</p>
            <form className='border p-3 rounded border-secondary'>
                <input type="text" placeholder='Video Caption'  className='form-control mt-3' onChange={(e)=>setVideo({...video,caption:e.target.value})} />
                <input type="text" placeholder='Video Image'  className='form-control mt-3'onChange={(e)=>setVideo({...video,image:e.target.value})} />
                <input type="text" placeholder='Video url' className='form-control mt-3' onChange={(e)=>validateLink(e)} />
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer theme='colored' position='top-center' autoClose={2000} />
   </>
  )
}

export default Add