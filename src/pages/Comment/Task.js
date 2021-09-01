import React, { useEffect } from 'react';
import { useState } from 'react';
import './task.css';
import { PlusOutlined, HomeOutlined, MenuOutlined, MessageOutlined, SmileOutlined, UserAddOutlined, FieldTimeOutlined, PictureOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Modal, Avatar, Form, Checkbox, Dropdown, DatePicker } from "antd"; // Quang
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid'
import { storage } from '../../firebase/firebase-config';
import { deleteDeadlineApi, deleteUserToTaskApi, getAllUserInTask, getComments, getDeadlineByTaskIdApi, getUsersToAddToTask, postCommentApi, postDeadlineToTaskApi, postUserToTaskApi, updateDeadlineApi, updateImageTask } from '../../Api/func/user';

function Task(props) {

    /**
     * Quang Bổ sung phần deadline
     */
    // new
    // deadline
    const [startDate, setStartDate] = useState("21/01/2021");
    const [endDate, setEndDate] = useState("25/08/2021");
    const [done, setDone] = useState(false);
    const [colorDone, setColorDone] = useState("");
    const [openDeadline, setOpenDeadline] = useState(false);
    const [isModalDeadVisible, setIsModalDeadVisible] = useState(false);
    const [deadlineDetail, setdeadlineDetail] = useState({})
    const [imageModal, setImageModal] = useState(false)
    const [usersModal, setUsersModal] = useState(false)

    //Hien thi o nhap deadline
    const showModalDead = async () => {
        console.log(done);
        setIsModalDeadVisible(true);
    };
    const handleCancelDead = () => {
        setIsModalDeadVisible(false);
    };

    const handleSaveDeadline = async () => {
        console.log(startDate);
        console.log(endDate);
        const dl = await getDeadlineByTaskIdApi({ taskId: props.obj.taskId });
        if (!dl.data) {
            await postDeadlineToTaskApi({
                taskId: props.obj.taskId,
                startDate: startDate,
                endDate: endDate,
                complete: false
            }).then(res => {
                console.log(res.data);
                setdeadlineDetail(res.data);
            }).catch(e => {
                console.log("Loi: ", e);
            });
        } else {
            await updateDeadlineApi({
                deadlineId: deadlineDetail.deadlineId,
                startDate: startDate,
                endDate: endDate,
                complete: !done
            }).then(res => {
                console.log("sau khi update:", res.data)
                setdeadlineDetail(res.data)
            });
            setOpenDeadline(true);
        }

        setOpenDeadline(true);
        setIsModalDeadVisible(false);
    };
    const handleDeleteDeadline = async () => {
        await deleteDeadlineApi({
            deadlineId: deadlineDetail.deadlineId
        });
        setOpenDeadline(false);
    };
    function getDateValue(dates, dateStrings) {
        setStartDate(dateStrings[0]);
        setEndDate(dateStrings[1]);
    }
    const onChangeCheckColor = async () => {
        setDone(!done);
        {
            done ? setColorDone("#61bd4f") : setColorDone("#EBECF0");
        }
        await updateDeadlineApi({
            deadlineId: deadlineDetail.deadlineId,
            startDate: deadlineDetail.startDate,
            endDate: deadlineDetail.endDate,
            complete: !done
        });
    };
    const { RangePicker } = DatePicker;
    const dateFormat = 'DD/MM/YYYY';

    //state
    const [comments, setcomments] = useState([]);
    const [contentCmt, setcontentCmt] = useState("");
    const [userTask, setuserTask] = useState([]);
    const [userNoTask, setuserNoTask] = useState([]);
    const [image, setimage] = useState(props.obj.image);

    //onchange
    const commentOnChange = (e) => {
        if (e.target.value) {
            setcontentCmt(e.target.value);
        }
    }
    //get all comment
    const getAllComment = async () => {
        const cmt = await getComments({
            taskId: props.obj.taskId
        });
        console.log("list cmt: ", cmt.data)
        return cmt.data;
    }
    //Lấy tất cả user được giao việc trong task
    const getAllUserTask = async () => {
        const ut = await getAllUserInTask({ taskId: props.obj.taskId })
        return ut.data;
    }
    //Lấy tât cả user trong bảng mà ko thuộc task
    const getAllUserNoTask = async () => {
        const unt = await getUsersToAddToTask({ taskId: props.obj.taskId });
        // const unt = await api.get("user_no_task");
        return unt.data;
    }

    //Chi tiết người dùng trong task
    const detailUserTask = async (obj) => {
        console.log("Chi tiết thằng bị đá khỏi task: ", obj);
        await deleteUserToTaskApi({
            userId: obj.id,
            taskId: props.obj.taskId
        }).then(async (res) => {
            const allUserTask = await getAllUserTask();
            if (allUserTask)
                setuserTask(allUserTask);
            const userNotask = await getAllUserNoTask();
            if (userNotask)
                setuserNoTask(userNotask)
        });
    }

    //Click nut them thanh vien
    //Hien thi Modal them thanh vien vao task
    const showModalUsers = async () => {
        const x = await getAllUserNoTask();
        setuserNoTask(x);
        setUsersModal(true);
    };
    const handleCancelModalUsers = () => {
        setUsersModal(false);
    };

    const btnAddMemberTask = async (obj) => {
        const arr = userNoTask;
        console.log("arr: ", arr)
        for (let i = 0; i < arr.length; i++) {
            if (obj.id === arr[i].id) {
                arr.splice(i, 1);
                // console.log(arr[i]);

            }
        }
        await postUserToTaskApi({
            userId: obj.id,
            taskId: props.obj.taskId
        });
        setuserTask([...userTask, obj])
        setuserNoTask([...arr]);
    }

    const showModalImage = async () => {
        setImageModal(true);
    };
    const handleCancelImageModal = () => {
        // setimage("");
        setImageModal(false);
    };

    //Ảnh bìa - chọn ảnh
    const imageOnChange = (e) => {
        if (e.target.files[0]) {
            setimage(e.target.files[0])
        }
    }
    //Ảnh bìa - tải lên ảnh
    const btnUploadImageOnClick = () => {
        console.log(image.name)
        if (image.name) {
            var imgSplit = image.name.split(".");
            var imgName = uuidv4() + "." + imgSplit[imgSplit.length - 1];
            const uploadTask = storage.ref(`images/${imgName}`).put(image);
            uploadTask.on(
                "state_change",
                snapshot => { },
                error => {
                    console.log(error);
                },
                () => {
                    storage.ref('images')
                        .child(imgName)
                        .getDownloadURL()
                        .then(async (url) => {
                            console.log(url);
                            await updateImageTask({
                                taskId: props.obj.taskId,
                                urlImage: url
                            }).then((res) => {
                                console.log("sau khi upload:", res)
                                setimage(res.data);
                            });

                        });
                }
            );
        } else alert("Chwa chon anh");
    }

    //post comment
    const postComment = async () => {
        const comment = {
            taskId: props.obj.taskId,
            content: contentCmt,
            fullName: props.user.fullName

        }
        // debugger;
        await postCommentApi({
            taskId: props.obj.taskId,
            content: contentCmt
        }).then(res => {
            setcomments([...comments, comment]);
            setcontentCmt("");
        });
    }

    //

    //useeffect
    useEffect(async () => {
        const dl = await getDeadlineByTaskIdApi({ taskId: props.obj.taskId });
        if (!dl.data) {
            console.log("Chua co dealine")
        } else {
            setdeadlineDetail(dl.data)
            setDone(dl.data.complete)
            setStartDate(dl.data.startDate);
            setEndDate(dl.data.endDate)
            setOpenDeadline(true);
        }
        const getAll = async () => {
            //comment
            const allComment = await getAllComment();
            if (allComment) {
                setcomments(allComment);
            }

            //user_task
            const allUserTask = await getAllUserTask();
            if (allUserTask)
                setuserTask(allUserTask);

        }
        setimage(props.obj.image)
        getAll();
    }, [props.obj.taskId])
    return (

        <>
            {/* <Modal centered width={800} visible={isModalVisible} footer={null}  onCancel={handleCancel}> */}
            <img src={(image) ? image : ""} className={(image === "" || image === null) ? "isHide" : ""} style={{ width: "100%", height: "400px", margin: "15px 0 10px 0" }} />
            <div className="modal-custom">
                <div className="card-left">
                    {/* Tên task */}
                    <div className="card-left__name flex mb-10" style={{ marginTop: "10px" }}>
                        <HomeOutlined className="common-icon width-10" />
                        {/* <div className="name-icon width-10">icon</div> */}
                        <div className="name-name">Tên thẻ</div>
                    </div>

                    {/* Thành viên, ngày hết hạn */}
                    <div className="card-left__memeber flex mb-10" style={{ fontSize: "14px" }}>
                        <div className="width-10" />
                        <div className="memeber-memeber" >
                            <div>THÀNH VIÊN</div>
                            <div>
                                {
                                    userTask.map((obj, index) => (
                                        <button key={index} onClick={() => detailUserTask(obj)} className="member-task">
                                            <Avatar style={{ color: '#fff', backgroundColor: '#84ABF7', fontSize: '12px', fontWeight: '500' }}>
                                                {(obj.fullName) ? obj.fullName.charAt(0).toUpperCase() : ""}
                                            </Avatar>
                                        </button>
                                    ))
                                }
                                <button onClick={showModalUsers} className="member-task">
                                    <Avatar style={{ color: '#fff', backgroundColor: '#84ABF7', fontSize: '12px', fontWeight: '500', margin: '0 0 0 2px' }}>
                                        <PlusOutlined />
                                    </Avatar>
                                </button>
                            </div>
                        </div>

                        {/* new */}
                        {/* deadline box */}
                        {openDeadline ? (
                            <div className="memeber-deadline" style={{ marginLeft: "20px" }}>
                                <div>NGÀY HẾT HẠN</div>
                                <div className="box-deadline">
                                    <div className="time-deadline">
                                        <Checkbox on checked={done} onChange={onChangeCheckColor} />
                                        <span>
                                            {endDate}
                                        </span>
                                        {done ? (
                                            <span className="check-done">Done !</span>
                                        ) : (
                                            <div />
                                        )}
                                        <Dropdown
                                            trigger="click"
                                            overlay={
                                                <Button
                                                    onClick={handleDeleteDeadline}
                                                    className="butDelete-Deadline"
                                                >
                                                    Delete Deadline
                                                </Button>
                                            }
                                            placement="bottomRight"
                                            arrow
                                        >
                                            <DownOutlined style={{ marginLeft: "7px" }} />
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div />
                        )}
                    </div>

                    {/* Tiêu đề mô tả: icon và chữ mô tả chi tiết */}
                    <div className="card-left__description flex mb-10">
                        <MenuOutlined className="common-icon width-10" />
                        <div className="des-name">Mô tả chi tiết</div>
                    </div>

                    {/* Ô input nhập mô tả */}
                    <div className="card-left__des-input flex mb-10">
                        <div className="width-10"></div>
                        <input style={{ padding: "0 0 0 10px" }} className="des-input" placeholder="Mô tả công việc" />
                    </div>

                    {/* Tiêu đề bình luận (Icon và Chữ Bình Luận) */}
                    <div className="card-left__cmt flex mb-10" style={{ marginTop: "40px" }}>
                        <MessageOutlined className="width-10 common-icon" />
                        <div className="cmt-name">
                            <div>Bình luận</div>
                            <Button>Ẩn chi tiết</Button>
                        </div>
                    </div>

                    {/* Viết bình luân (Avatar và ô input) */}
                    <div className="card-left__cmt flex mb-10">
                        {/* <div className="width-10 avatar">L</div> */}
                        <Avatar style={{ color: '#fff', backgroundColor: '#84ABF7', fontSize: '12px', fontWeight: '500', margin: '5px 15px 0 12px' }}>
                            L
                        </Avatar>
                        <input onChange={commentOnChange} value={contentCmt} style={{ padding: "0 0 0 10px" }} className="cmt-input" placeholder="Viết Bình Luận" />
                    </div>

                    {/* Nút bình luận */}
                    <div className="flex mb-10">
                        <div className="width-10"></div>
                        <Button onClick={postComment}>Lưu</Button>
                    </div>



                    {/* Nội dung bình luận (avatar và nội dung bình luận) */}
                    {
                        comments.map((obj, index) => (
                            <div key={index} className="card-left__cmt-content flex mb-10">
                                {/* avatar*/}
                                <Avatar style={{ color: '#fff', backgroundColor: '#84ABF7', fontSize: '12px', fontWeight: '500', margin: '5px 15px 0 12px' }}>
                                    {(obj.fullName) ? obj.fullName.charAt(0).toUpperCase() : ""}
                                </Avatar>
                                {/* Nội dung bình luận: tên, ngày, nội dung, reaction, sửa, xoá */}
                                <div className="cmt-right">
                                    <div className="cmt-user">
                                        {/* Tên người bình luận */}
                                        {obj.fullName}
                                        <span className="cmt-date">
                                            {/* Ngày bình luận */}
                                            {obj.createDate}
                                        </span>
                                    </div>
                                    <div className="cmt-content">
                                        {/* Nội dung bình luận */}
                                        {obj.content}
                                    </div>
                                    <div className="cmt-react">
                                        <SmileOutlined /> - Chỉnh sửa - Xoá
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
                {/* Bên phải modal: các chức năng */}
                <div className="card-right">
                    <div className="btn-right">
                        <Button onClick={showModalUsers} style={{ width: "100%" }}>
                            <UserAddOutlined />
                            Thành viên
                        </Button>
                        <Modal width={300} title="Thành viên" visible={usersModal} footer={null} onCancel={handleCancelModalUsers} >
                            <div className="title-member-board">Thành viên của bảng</div>

                            {/* Danh sachs thành viên trong bảng nhưng ko có trong task */}
                            {
                                userNoTask.map((obj, index) => (
                                    <div key={index} className="memeber-list">
                                        <button onClick={() => btnAddMemberTask(obj)} className="btn-member-task">
                                            <Avatar className="avatar">{(obj.fullName) ? (obj.fullName.charAt(0).toUpperCase()) : ""}</Avatar>
                                            {obj.fullName}
                                        </button>
                                    </div>
                                ))
                            }

                            <div className="title-member-board">Thành viên của Task</div>
                            {
                                userTask.map((obj, index) => (
                                    <div key={index} className="memeber-list">
                                        <button onClick={() => detailUserTask(obj)} className="btn-member-task">
                                            <Avatar className="avatar">{(obj.fullName) ? (obj.fullName.charAt(0).toUpperCase()) : ""}</Avatar>
                                            {obj.fullName}
                                        </button>
                                    </div>
                                ))
                            }
                            {/* </div> */}
                        </Modal>
                    </div>

                    {/* new */}
                    {/* Deadline */}
                    <div className="btn-right">
                        <Button onClick={showModalDead} style={{ width: "100%" }}>
                            <FieldTimeOutlined />
                            Ngày
                        </Button>
                        <Modal width={300} title="Deadline" visible={isModalDeadVisible} footer={null} onCancel={handleCancelDead} >
                            <div>
                                <Form>
                                    <div className="title-date">
                                        <h4>Start Date</h4>
                                        <h4 style={{ marginLeft: "68px" }}>End Date</h4>
                                    </div>
                                    <RangePicker defaultValue={[moment(startDate, dateFormat), moment(endDate, dateFormat)]} format={dateFormat} onChange={getDateValue} />
                                    <br />
                                    <Button onClick={handleSaveDeadline} style={{ marginTop: "15px" }} type="primary">
                                        Save
                                    </Button>
                                </Form>
                            </div>
                        </Modal>
                    </div>

                    <div className="btn-right">
                        <Button onClick={showModalImage} style={{ width: "100%" }}>
                            <PictureOutlined />
                            Ảnh Bìa
                        </Button>
                        <Modal width={400} title="Ảnh bìa" visible={imageModal} footer={null} onCancel={handleCancelImageModal}>
                            <div className="title-member-board">Tệp Đính Kèm</div>
                            <input onChange={imageOnChange} style={{ marginLeft: "13px" }} type="file" accept="image/*" />
                            <Button onClick={btnUploadImageOnClick} style={{ width: "90%", margin: "20px 0 0 13px" }}>Upload</Button>
                            <img className={(image === "" || image === null) ? "isHide" : ""} style={{ width: "300px", height: "150px", margin: "10px 0 0 20px" }} src={(image) ? image : ""} />

                        </Modal>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Task;