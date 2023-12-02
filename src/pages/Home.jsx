import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { FaAnglesLeft } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";
import { LuSendHorizonal } from "react-icons/lu";
import "../styles/home.css";

const Home = () => {
    const [array, setArray] = useState([]);
    const [arrayForSearch,setArrayForSearch] = useState([]);
    const [total,setTotal] = useState([]);
    const [page,setPage] = useState(0);
    const [searchtext,setSearchtext] = useState('');
    const [isChacked,setIsChacked] = useState([]);
    const [topCheck,setTopChecked] = useState(false);
    const [edit,setEdit] = useState(-1);
    const [name,setName] = useState('');
    const [email,seteMail] = useState('');
    const [role,setRole] = useState('');
    useEffect(()=>{
        const getArray = async() => {
            try {
                const {data} = await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
                setArray(data);
                setArrayForSearch(data);
            } catch (error) {
                console.log(error);
            }
            
        }
        getArray();
    },[]);

    useEffect(()=>{
        if(array){
            const no = Math.ceil(array.length/10);
            setTotal(Array.from({ length: no }, (_, index) => index + 1));
        }
    },[array])

    const handleKeyPress = (e) =>{
        if(e.key === 'Enter')
            find();
    }

    const find = () =>{
        const arr = arrayForSearch.filter((user)=>(
            searchtext === '' ? user : user.name.toLowerCase().includes(searchtext.toLowerCase()) ? user : user.email.toLowerCase().includes(searchtext.toLowerCase()) ? user : user.role.toLowerCase().includes(searchtext.toLowerCase())
        ))
        setArray(arr);
        setTopChecked(false);
    }

    const changePage = (index) =>{
        setPage(index);
        if(topCheck)
            setIsChacked([]);
        setTopChecked(false);
    }

    const deleteOne = (index,id) =>{
        const arr = array.filter((_,i)=>(index!==i));
        if(isChacked.includes(id)){
            const arr2 = isChacked.filter((i)=>(i!==id));
            setIsChacked(arr2);
        }
        setArray(arr);
        const arr2 = arrayForSearch.filter((_,i)=>(index!==i));
        setArrayForSearch(arr2);
        setTopChecked(false);
    }


    const deleteBulk = () =>{
        const arr = array.filter((index)=>!isChacked.includes(index.id));
        setArray(arr);
        const arr2 = arrayForSearch.filter((index)=>!isChacked.includes(index.id));
        setArrayForSearch(arr2);
        setTopChecked(false);
        setIsChacked([]);
    }

    const handeleCheckbox = (e) =>{
        const {value,checked} = e.target;
        if(checked){
            setIsChacked([...isChacked,value]);
        }
        else{
            setIsChacked(isChacked.filter((e)=>e!==value));
        }
    }

    const handelTopChecked = () =>{
        if(!topCheck){
            const arr = array.filter((_,index)=>(
                (index>=page*10 && (page+1)*10>index)
            )).map((user)=>(user.id));
            setIsChacked(arr);
        }
        else{
            setIsChacked([]);
        }
        
        setTopChecked(!topCheck);
    }

    const handleEdit = (id,Name,Email,Role) =>{
        setEdit(id);
        setName(Name);
        seteMail(Email);
        setRole(Role);
    }

    const uploadChanges = () => {
        const arr = array.map(user=>{
            if(user.id===edit){
                return{
                    ...user,
                    name:name,
                    email:email,
                    role:role,
                }
            }
            return user;
        })

        setArray(arr);

        const arr2 = arrayForSearch.map(user=>{
            if(user.id===edit){
                return{
                    ...user,
                    name:name,
                    email:email,
                    role:role,
                }
            }
            return user;
        })
        setArrayForSearch(arr2);

        setEdit(-1);
    }


  return (
    <div className='home'>
        <div className='first-child'>
            <div className='search-div'>
                <input placeholder='Search' className='search' onChange={(e)=>setSearchtext(e.target.value)} onKeyPress={handleKeyPress} />
                <button className='search-icon' onClick={()=>find()} ><CiSearch /></button>
            </div>
            <button className='delete-all' onClick={()=>deleteBulk()}><RiDeleteBin6Line /></button>
        </div>


        <div className='second-child'>
            <table>
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" checked={topCheck} onChange={()=>handelTopChecked()} />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {array &&
                        array.filter((_,index)=>(
                            (index>=page*10 && (page+1)*10>index)
                        )).map((user,index)=>(

                            edit===user.id ?
                            <tr key={index} className={isChacked.includes(user.id) ? 'selected':''}>
                                <td>
                                    <input type="checkbox" value={user.id} checked={isChacked.includes(user.id)} onChange={(e)=>handeleCheckbox(e)}/>
                                </td>
                                <td>
                                    <input className='edit-input' type='text' value={name} onChange={(e)=>setName(e.target.value)} />
                                </td>
                                <td>
                                    <input className='edit-input' type='text' value={email} onChange={(e)=>seteMail(e.target.value)} />
                                </td>
                                <td>
                                    <input className='edit-input' type='text' value={role} onChange={(e)=>setRole(e.target.value)} />
                                </td>
                                <td>
                                    <button className='save' onClick={()=>uploadChanges()}><LuSendHorizonal /></button>
                                </td>
                            </tr>
                            
                            :
                        
                            <tr key={index} className={isChacked.includes(user.id) ? 'selected':''}>
                                <td>
                                    <input type="checkbox" value={user.id} checked={isChacked.includes(user.id)} onChange={(e)=>handeleCheckbox(e)}/>
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className='edit' onClick={()=>handleEdit(user.id,user.name,user.email,user.role)}><FaRegEdit /></button>
                                    <button className='delete' onClick={()=>deleteOne(index,user.id)} ><RiDeleteBin6Line /></button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>



        <div className='end-child'>
            <div>{isChacked.length} out of {array.length} row(s) selected</div>
            <div className='pagination-div'>
                <button className='first-page' disabled={page===0} onClick={()=>changePage(0)}><FaAnglesLeft /></button>
                <button className='previous-page' disabled={page===0} onClick={()=>changePage(page-1)}><FaAngleLeft /></button>
                {
                    total.map((_,index)=>(
                        <button className={page===index ? 'pagination-button-active' :'pagination-button'} key={index} onClick={()=>changePage(index)}>{index+1}</button>
                    ))
                }
                <button className='next-page' disabled={page===total.length-1 || array.length===0} onClick={()=>changePage(page+1)}><FaAngleRight /></button>
                <button className='last-page' disabled={page===total.length-1 || array.length===0} onClick={()=>changePage(total.length-1)}><FaAnglesRight /></button>
            </div>
        </div>

    </div>
  )
}

export default Home