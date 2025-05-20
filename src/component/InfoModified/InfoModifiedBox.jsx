import { dateTimePickerTabsClasses } from '@mui/x-date-pickers';
import { set } from 'date-fns';
import React, {useState} from 'react';
import { data } from 'react-router-dom';
import { useEffect } from 'react';

const InfoModifiedBox = () => {
    const [passwordChecked, setPasswordChecked] = useState(false); // 비밀번호 일치 여부

    // 로그인정보 가져오기
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    //비동기 async & await
    const handlePasswordCheck = async() => {
        //loginId로 password찾아서 확인하고 바꾸기
        const loginId = document.getElementById('loginId').value;
        const password = document.getElementById('password').value;

        if (!password) {
            document.getElementById('pwCheck').classList.add('d-none');
            document.getElementById('newPwConfirm').classList.remove('d-none');
            return;
        }
        const formData = new URLSearchParams();
        formData.append("loginId", loginId);
        formData.append("password", password);

        console.log("보내는 데이터:", formData.toString());
        
        
        try {
            const response = await fetch('/api/user/check-password', {
                method: 'POST',
                headers: {
                    // 'Content-Type' : 'application/json',
                    'Content-Type' : 'application/x-www-form-urlencoded',
                },
                // body: JSON.stringify({loginId, password})
                body: formData
            });
            console.log(response);    
            
            if (response.ok) {
                const result = await response.json();
                if (result.code === 200) {
                    setPasswordChecked(true);
                    document.getElementById('pwCheck').classList.add('d-none');
                    document.getElementById('newPwConfirm').classList.remove('d-none');
                } else {
                    setPasswordChecked(false);
                    document.getElementById('pwCheck').classList.remove('d-none');
                    document.getElementById('newPwConfirm').classList.add('d-none');
                    
                }
            } else {
                throw new Error('서버 응답 오류');
            }
        } catch (error) {
            console.log('비밀번호 확인 중 오류 발생: ', error);
            alert('비밀번호 확인 중 오류 발생: ', error);
        }

    };

    const handleSubmit = (e) => {
        if (!passwordChecked) {
            e.preventDefault(); // 제출막기
            alert("비밀번호를 먼저 확인해주세요");
        }
    };


    // 사용자 정보 가져오기
    const userInfo = async () => {
        try {
            //로컬 스토리지에 저장한 이메일, 이름으로 조회
            const email = localStorage.getItem('email');
            const name = localStorage.getItem('name');

            if (!email || !name) {
                console.log('이메일 또는 이름 정보가 없습니다.');
                return;
            }

            const userInfoData = {
                email: email,
                name: name
            }

            const response = await fetch('/api/user/info', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body:JSON.stringify(userInfoData)
            })

            if (response.ok) {
                const data = await response.json();
                if (data.code === 200) {
                    console.log(data.result);
                    // 사용자 정보 넣기
                    setLoginId(data.loginId);
                    setPassword(data.password);
                    console.log(data.password);
                    setEmail(data.email);
                    setName(data.name);
                    setPhoneNumber(data.phoneNumber);
                } else {
                    console.log(data.error_message);
                }
            }
        } catch (error) {
            console.log("사용자 정보 불러오기 실패: " + error)
        }
    }

    // 사용자 정보 넣기
    useEffect(() => {
        userInfo();
    }, []);


    return (
        <div className="shadow-box">
            <div className="sign-up-box">
                <h1 className="m-4 text-center">내 정보</h1>
                    <form id="signUpForm" method="post" action="/user/modified" onSubmit={handleSubmit}>
                        <span className="sign-up-subject">ID</span>
                        <div className="d-flex ml-3 mt-3">
                            <input type="text" id="loginId" name="loginId" className="form-control" value={loginId} readOnly style={{ backgroundColor: '#e9ecef' }}/>
                        </div>

                        <span className="sign-up-subject">현재 비밀번호</span>
                        <div className="ml-3 mt-3">
                            <input type="password" id="password" name="password" className="form-control col-6" value={password} readOnly style={{ backgroundColor: '#e9ecef' }} />
                        </div>
                        <input type="button" id="modifiedBtn" className="btn text-white"  value="비밀번호 확인" onClick={handlePasswordCheck} style={{ backgroundColor:'#00eeff'}} />
                        
                        <div className="ml-3 mb-3">
                                    <div id="pwCheck" className="small text-danger d-none">기존 비밀번호와 일치하지 않습니다.</div>
                                    {/* <div id="newPwCheck" className="small text-danger d-none">새로운 비밀번호가 일치하지 않습니다.</div>
                                    <div id="newPwLengthCheck" className="small text-danger d-none">비밀번호는 최소 4자리 이상이어야 합니다.</div> */}
                                    <div id="newPwConfirm" className="small text-success d-none">비밀번호 확인</div>
                        </div>           
                        
                        <br />
                        <span className="sign-up-subject">새로운 비밀번호</span>
                        <div className="ml-3 mt-3">
                            <input type="password" id="newPassword" name="newPassword" className="form-control col-6" placeholder="새로운 비밀번호를 입력하세요" readOnly style={{ backgroundColor: '#e9ecef' }}/>
                        </div>

                        <br />
                        <span className="sign-up-subject">새로운 비밀번호 확인</span>
                        <div className="ml-3 mt-3">
                            <input type="password" id="newConfirmPassword" name="newConfirmPassword" className="form-control col-6" placeholder="새로운 비밀번호를 입력하세요" readOnly style={{ backgroundColor: '#e9ecef' }}/>
                        </div>
                        
                        <br />
                        <span className="sign-up-subject">이름</span>
                        <div className="ml-3 mt-3">
                            <input type="text" id="name" name="name" className="form-control col-6" placeholder="이름을 입력하세요"  value={name} readOnly style={{ backgroundColor: '#e9ecef' }}/>
                        </div>

                        <br />
                        <span className="sign-up-subject">이메일</span>
                        <div className="d-flex ml-3 mt-3">
                            <input type="text" id="email" name="email" className="form-control" placeholder="이메일을 입력하세요"  value={email} readOnly style={{ backgroundColor: '#e9ecef' }}/>
                        </div>

                        <br />
                        <span className="sign-up-subject">전화번호</span>
                        <div className="ml-3 mt-3">
                            <input type="text" id="phoneNumber" name="phoneNumber" className="form-control col-6" placeholder="전화번호" value={phoneNumber}  readOnly style={{ backgroundColor: '#e9ecef' }}/>
                        </div>
                        
                        <div className="d-flex justify-content-space m-3">
                            <button type="submit" id="infoUpdateBtn" className="btn text-white" style={{ backgroundColor:'#B78812'}}>정보수정</button>
                        </div>
                    </form>
            </div>
        </div>
    );
};

export default InfoModifiedBox;