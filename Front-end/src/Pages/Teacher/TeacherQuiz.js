import React,{Component} from 'react';
//import Aux from '../../../hoc/ReactFrag';
//import Scroll from 'react-scroll';
//import Tinput from './TinputFields';
//import TeacherTittle from './TeacherTittle';
import Layout from '../../components/Layout/Layout';
import {Redirect} from 'react-router-dom';
import './CSS/Teacher.css';
import axios from '../../ApiServices/axiosUrl';
import AuthServices from '../../ApiServices/auth.service';
import Alert from '../Auth/Forms/alert';
import ProgressBar from 'react-bootstrap/ProgressBar';
import CKEditorArea from './CKEditor';
import * as actionCreators from "../../store/actions/actions";
import TeacherTittle from './TeacherTittle';
import Tinput from './TinputFields';

class TeacherQuestion extends Component{


    state = { 
        Form:{
            Question1:{
                label: "Enter the quiz Question",
                rows: "1",
                cols: "50",
                placeholder: 'Question 1',
                value: "",
                validation: {
                    required: true,
                    minLength:1,
                    
                },
                 valid:false,
            },
            Question2:{
                label: "Enter the quiz Question",
                rows: "1",
                cols: "50",
                placeholder: 'Question 2',
                value: "",
                validation: {
                    required: true,
                    minLength:1,
                    
                },
                 valid:false,
            },
            Question3:{
                label: "Enter the quiz Question",
                rows: "1",
                cols: "50",
                placeholder: 'Question 3',
                value: "",
                validation: {
                    required: true,
                    minLength:1,
                    
                },
                 valid:false,
            },
            Question4:{
                label: "Enter the quiz Question",
                rows: "1",
                cols: "50",
                placeholder: 'Question 4',
                value: "",
                validation: {
                    required: true,
                    minLength:1,
                    
                },
                 valid:false,
            },
            Question5:{
                label: "Enter the quiz Question",
                rows: "1",
                cols: "50",
                placeholder: 'Question 5',
                value: "",
                validation: {
                    required: true,
                    minLength:1,
                    
                },
                 valid:false,
            },

            _id: {
                value: localStorage.getItem('userId'),
                valid:true,
            },

    },
     
    alert: {
        valid:false,
        msg:"",
        alertType:" ",
        
    },
    CourseNames:["Web Development","Programming Languages","AI / ML","Cloud Development","Data Science"],
    isLoggedIn:false,
    userName:"",
    alertPressed:false,
    uploadedPercentage:0,
    CourseId:"",
    redirect:false,
    
}

    componentDidMount(){
        let userToken = AuthServices.getCurrentUser();
        let userName= AuthServices.getUserName();
        if(userToken!==null){
            this.setState({isLoggedIn:true,userName:userName});
        }
        
    }

    checkValidity(value,rules){
        let isValid = true;
      

        if(rules.required){
            isValid =value.trim()!=='' && isValid;
        }

        if(rules.minLength){
            isValid = value.length >= rules.minLength  && isValid;
        }
     
        
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength  && isValid;
        }

       

        return isValid;
        
     }

     OverallValidity = ()=>{

        for(let validate in this.state.Form){
           
            

            if(!this.state.Form[validate].valid){
                return false;
            }
         
        }
        return true;
    }
    
    
    AlertError(alertmsg, alertType) {
        const AlertArray = {...this.state.alert};
        AlertArray.msg = alertmsg;
        AlertArray.valid=true;
        AlertArray.alertType=alertType;
        this.setState({alert:AlertArray});

    }

    CKEditorHandler  =(event,editor,Title)=> {

        const data =editor.getData();
        const updatedForm = {
            ...this.state.Form
        }
        updatedForm[Title].value=data;
        updatedForm[Title].valid=this.checkValidity(data, updatedForm[Title].validation)
        this.setState({Form:updatedForm})

    }


    inputchangeHandler = (event,inputIdentifier)=> {

        const updatedForm = {
            ...this.state.Form
        }
        const updatedElement = {...updatedForm[inputIdentifier]}
        

        updatedElement.value = event.target.value;


        updatedForm[inputIdentifier] = updatedElement;

        updatedElement.valid = this.checkValidity(updatedElement.value,
            updatedElement.validation);


        this.setState({Form: updatedForm});

    }

    


    fileSelectorHandler = event =>{
    
        const selectedfile= {...this.state.Form};

        selectedfile.image.value= event.target.files[0];
       
        selectedfile.image.name= URL.createObjectURL(event.target.files[0]);
        this.setState({Form:selectedfile })
            //console.log(selectedfile)
    }


    


    sumbitButton =()=> {
        
        this.setState({alertPressed:true})
        setTimeout( ()=> this.setState({alertPressed:false}) , 2000);
  
        const fd = new FormData();

      
        for(let formElement in this.state.Form){
            
            fd.append(formElement, this.state.Form[formElement].value);
            
            console.log(formElement,this.state.Form[formElement].value);
        }


       

        if(this.OverallValidity()){

                axios.post('creator/create-course',fd,{
                    onUploadProgress: progressEvent => {
                        //console.log("Progress bar");
                        const {loaded,total} =progressEvent;
                        let percent =Math.floor((loaded*100)/total);
                       // console.log("percent" + percent)
                        if(percent<100){
                            this.setState({uploadedPercentage:percent})
                        }
                    }
                },{
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Access-Control-Allow-Origin": '*',
                       // "Authorization": 'Bearer '+ localStorage.getItem('user') 
                    }
                })
                .then( res=> { 
                    console.log(res);
                    this.props.AddCourseToStore(res.data.newCourse)
                    this.setState({CourseId:res.data.newCourse._id})
                    this.AlertError("Your Course has been saved!", "success");
                    setTimeout( ()=> this.setState({redirect:true}) , 2000);

                })

                .catch(error => { console.log(error.response)
                    this.AlertError(error.response.data.message, "danger");
                    // if(error.response.data.message ==="jwt malformed" )
                    //     this.setState({redirect:"/login"})
                });
        
        }
        else
            this.AlertError("Validation Errors!", "warning");
       
    }
 
    

    render(){

    
        let classWeb=[];
        let classML=[];
        let classCd=[];
        let classDs=[];
        let classPL=[];
        let Welcome = null;
        let alertContent = null;
        let fileName=null;
       
        if(this.state.redirect){
            return <Redirect 
                    to={{
                        pathname: "/TeacherVideos",
                        state: {CourseId:this.state.CourseId }
                    }}
            />
        }
        

        if(this.state.alert.valid){
            alertContent = ( <Alert alertMsg ={this.state.alert.msg} 
                                    alertType={this.state.alert.alertType} 
                                    value={this.state.alertPressed}/> )
        }
        
        if(this.state.isLoggedIn) {
            Welcome = <p > Welcome {this.state.userName}!</p>;
        }
          
      

        return(

          
    <Layout >
        <div className="container-fluid-main">

            {alertContent}

            <div className="Welcome-msg">
                
                    {Welcome}

            </div>

        
        <div className="Teacher-Head-Class">
        
                    
                <Tinput
                label={this.state.Form.Question1.label}
                rows={this.state.Form.Question1.rows}
                cols={this.state.Form.Question1.cols}
                placeholder={this.state.Form.Question1.placeholder}
                changed={(event)=> this.inputchangeHandler(event,"Question1")}
                />


        </div>
        <div className="Teacher-Head-Class">
        
                    
                <Tinput
                label={this.state.Form.Question2.label}
                rows={this.state.Form.Question2.rows}
                cols={this.state.Form.Question2.cols}
                placeholder={this.state.Form.Question2.placeholder}
                changed={(event)=> this.inputchangeHandler(event,"Question2")}
                />


        </div>
        <div className="Teacher-Head-Class">
        
                    
                <Tinput
                label={this.state.Form.Question3.label}
                rows={this.state.Form.Question3.rows}
                cols={this.state.Form.Question3.cols}
                placeholder={this.state.Form.Question3.placeholder}
                changed={(event)=> this.inputchangeHandler(event,"Question3")}
                />


        </div>
        <div className="Teacher-Head-Class">
        
                    
                <Tinput
                label={this.state.Form.Question4.label}
                rows={this.state.Form.Question4.rows}
                cols={this.state.Form.Question4.cols}
                placeholder={this.state.Form.Question4.placeholder}
                changed={(event)=> this.inputchangeHandler(event,"Question4")}
                />


        </div>
        <div className="Teacher-Head-Class">
        
                    
                <Tinput
                label={this.state.Form.Question5.label}
                rows={this.state.Form.Question5.rows}
                cols={this.state.Form.Question5.cols}
                placeholder={this.state.Form.Question5.placeholder}
                changed={(event)=> this.inputchangeHandler(event,"Question5")}
                />


        </div>

        
            <div className="Welcome-msg sumbitVideoBtn">
                <button onClick={this.sumbitButton} >Next</button>
            </div>

          
        </div>
    </Layout>
        


        );
    }
}

// const mapStateToProps = (state) => {
//     return {
//          Courses: state.filter.Courses,
//          PreferenceCourses: state.filter.PreferenceCourse,
//     //   selectedCourse: state.filter.selectedCourse,
//     };
//   };
  const mapDispatchToProps = (dispatch) => {
    return {
        AddCourseToStore:(data)=>dispatch(actionCreators.AddCourseToStore(data)),
        //  fetchPreferenceCourses:(CourseLink,form)=>dispatch(actionCreators.fetchAsyncPreferenceCourse(CourseLink,form))
    };
  };
export default TeacherQuestion;