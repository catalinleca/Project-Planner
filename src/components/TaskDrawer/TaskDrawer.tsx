import * as React from 'react';
import {
  AppBar,
  Drawer,
  Grid,
  Theme,
  withStyles,
  WithStyles,
  Toolbar,
  Typography, TextField, Button, Menu, MenuItem, IconButton

} from '@material-ui/core';
import {Field, reduxForm} from 'redux-form';
import {
  StyleRules
} from '@material-ui/core/styles';
import {
  compose,
} from 'redux';
import {connect} from "react-redux";
import {
  ChangeTaskProjectAction, ChangeTaskStatusAction,
  closeTaskDrawerAction,
  CreateProjectAction, DeleteTaskAction,
  doTheThingAction,
  FirstAction
} from "../../store/action";
import {createStructuredSelector} from "reselect";
import {
  makeSelectDataById, makeSelectFirestoreOrderedData, makeSelectLoggedInUserId,
  makeSelectSelectedTask,
  makeSelectTaskDrawerOpen,
  selectReducerState
} from "../../store/selectors";
import DisplayEdit from "../DisplayEdit/DisplayEdit";
import FieldTextField from "../FieldTextField/FieldTextField";
import {firestoreConnect} from "react-redux-firebase";
import StatusChip from "../StatusChip/StatusChip";
import {taskStatusValues} from "../../utils/constants";
import FieldReactSelect from "../FieldReactSelect/FieldReactSelect";
import FieldDatePicker from "../FieldDatePicker/FieldDatePicker";
import AddNewTaskForm from "../../containers/CreateNewProject/AddNewTaskForm/AddNewTaskForm";
import classnames from 'classnames';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DisplayPictures from "../DisplayPictures/DisplayPictures";
import UploadPicture from "../UploadPicture/UploadPicture";
import DialogComponent from "../DialogComponent/DialogComponent";

const styles = (theme: Theme): StyleRules => ({
  root: {},
  container: {
    width: '400px',
    margin: '0 auto',
    [theme.breakpoints.up('md')]: {
      width: '800px',
    }
  },
  drawerBodyContainer: {
    padding: '24px'
  },
  marginRight: {
    marginRight: '8px'
  },
  selectAssigned: {
    // width: '100%'
  },
  fieldData: {
    marginBottom: '12px'
  },
  descriptionField: {
    marginLeft: '2px'
  },
  buttonsFooter: {
    paddingBottom: '12px',
    paddingRight: '40px'
  }
});

interface ITaskDrawerComponentProps {
  onSubmit: any,
  pictures: string[]
  picturesAsFile: string[]
  handleAddPictures?: any
  handleRemovePictures?: any
  emptyPicturesState?: any
  handleState?: any

}

//from state
interface ITaskDrawerProps extends ITaskDrawerComponentProps {
  taskDrawerOpen: boolean
  closeDrawer: any;
  task: any;
  changeTaskProject: any;
  projects: any;
  changeTaskStatus: any;
  selectedTaskId: any;
  handleSubmit: any;
  users: any;
  createdByUser: any;
  initialize: any;
  deleteTask: any;
  loggedInUserId: any;
}

export type TaskDrawerType = ITaskDrawerProps & WithStyles<keyof ReturnType<typeof styles>>;

interface ITaskDrawerState {
  edit: boolean;
  projectAnchorEl: any;
  taskStatusAnchorEl: any;
  open: boolean;
}

const WithLabel: React.FC<any> = ({children, label, show = true}) => {
  return(
    <Grid
      container={true}
      direction='column'
      alignItems='flex-start'
      style={{
        marginBottom: '12px'
      }}
    >
      {show && <Typography variant='caption'>{label}</Typography>}
      {children}
    </Grid>
  )
}

class TaskDrawer extends React.Component<TaskDrawerType, {}> {

  public state: ITaskDrawerState = {
    edit: false,
    projectAnchorEl: null,
    taskStatusAnchorEl: null,
    open: false,
  }

  public handleInitialize() {
    const {
      task
    } = this.props;

    const initData = task && {
      'title': task.title,
      'assignedTo': {
        label: [task.assignedTo.firstName, task.assignedTo.lastName].join(' '),
        firstName: task.assignedTo.firstName,
        lastName: task.assignedTo.lastName,
        id: task.assignedTo.id,
        value: task.assignedTo.id
      },
      'description': task.description,
      'dueDate': task.dueDate,
      // 'pictures': task.pictures && [...task.pictures]
    }

    this.props.initialize(initData);
  }

  public handleEditAddPicture = (e) => {
    console.log('handlePictureChange: ', this.props.pictures)

    this.props.handleAddPictures(e.target.files)
    // this.setState({
    //   pictures: [
    //     ...this.state.pictures,
    //     ...e.target.files
    //   ]
    // })
  }
  //
  // componentDidMount() {
  //   this.props.handleState(this.props.task)
  // }

  public componentDidUpdate = (prevProps) => {
    this.props.task && prevProps.taskDrawerOpen !== this.props.taskDrawerOpen && this.props.handleState(this.props.task)
  }

  public handleClick = () => {
    this.setState({
      type: 'input'
    })
  }

  public someFunction = () => {
    console.log('123');
    this.setState({
      pictures: this.props.task && this.props.task.pictures
    })
  }

  public toggleEdit = () => {
    this.setState((prevState: ITaskDrawerState) => ({
      edit: !prevState.edit,
      // pictures: !prevState.edit && this.props.task.pictures
    }))
    this.handleInitialize()
  }

  public handleProjectMenuClose = () => {
    this.setState({projectAnchorEl: null})
  }

  public handleProjectMenuOpen = (e) => {
    this.setState({projectAnchorEl: e.currentTarget})
  }

  public handleProjectMenuClick = (projectName, projectId) => {
    const {
      changeTaskProject
    } = this.props;

    changeTaskProject(projectName, projectId)
    this.setState({projectAnchorEl: null})

  }

  public onChangeTaskStatus = (status) => {
    const {
      changeTaskStatus,
      selectedTaskId
    } = this.props
    // this.props.changeTaskStatus(this.props.selectedTaskId, status);
    changeTaskStatus(selectedTaskId, status);
    this.setState({taskStatusAnchorEl: null});

  }

  public handleTaskStatusOpen = event => {
    this.setState({taskStatusAnchorEl: event.currentTarget});
  };

  public handleTaskStatusClose = () => {
    this.setState({taskStatusAnchorEl: null});
  };

  public formatStringDate = (date: any) => {
    if (date) {
      const newDate = new Date(date)
      return newDate.getDate() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getFullYear()
    } else {
      return null
    }
  }

  public emptyPicturesArray = () => {
    this.setState({pictures: []})
  }

  public getCreatedByName = () => {
    const {
      createdByUser: user
    } = this.props;

    return  user && `${user.firstName.trim()}${user.lastName.trim()}`
  }

  public handleCloseDrawer = () => {
    this.setState({edit: false})
    this.props.closeDrawer()
    this.props.emptyPicturesState()
  }

  public handleSubmit = (values) => {
    console.log('handleSubmit values: ', values);
    this.props.handleSubmit(values)
    this.setState({edit: false})
  }

  // vezi ce zice ala de memoization in documentatie
  /**
   * CHANGE THIS SHIT ASAP
   * @param prevProps
   * @param prevState
   */
  // public getSnapshotBeforeUpdate(prevProps, prevState) {
  //   // console.log('prevProps: ', prevProps.task)
  //   //
  //   // console.log('this.props: ', this.props.task)
  //   if(prevProps.task && this.props.task) {
  //     if (prevProps.task.title !== this.props.task.title) {
  //       console.log('john: ', this.props.task.pictures)
  //       this.setState({pictures: this.props.task.pictures})
  //     }
  //   }
  // }

  public handleClickOpen = () => {
    this.setState({
      open: true,
    });
  }

  public handleClose = () => {
    this.setState({
      open: false,
    });
  }

  public onDeleteHandler = () => {
    const {
      deleteTask,
      selectedTaskId,
      closeDrawer
    } = this.props;

    deleteTask(selectedTaskId);
    closeDrawer();
    this.handleClose();
  }

  // could improve a little, passing task from parent and keeping openDrawerState in the component's state
  // but since we use projects and users there wouldn't be much of an improvement
  render() {
    const {
      taskDrawerOpen,
      closeDrawer,
      classes,
      task,
      projects,
      users,
      pictures,
      picturesAsFile,
      loggedInUserId
    } = this.props;

    const {
      edit,
      projectAnchorEl,
      taskStatusAnchorEl
    } = this.state;

    // console.log('state pics: ', this.props)
    // console.log('task  pics: ', this.props.task && this.props.task.pictures)
    const now = new Date();
    const fullName =  task && [task.assignedTo.firstName, task.assignedTo.lastName].join(' ').split(' ').filter( value => value != '').join(' ')

    const taskCreatedDate = task && new Date(task.createdDate)
    const createdDate =  taskCreatedDate && taskCreatedDate.getDate() + "-" + (taskCreatedDate.getMonth() + 1) + "-" + taskCreatedDate.getFullYear()

    const taskStatus = task && (
      <WithLabel
        label='Task Status'
      >
        <StatusChip
          status={task.taskStatus}
          anchorEl={taskStatusAnchorEl}
          options={taskStatusValues}
          changeStatus={this.onChangeTaskStatus}
          handleOpen={this.handleTaskStatusOpen}
          handleClose={this.handleTaskStatusClose}
        />
      </WithLabel>
    )

    const taskProject = task && (
      <WithLabel
        label='Task Project'
      >
        <Grid>
          <Button color='secondary' aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleProjectMenuOpen} variant='outlined'>
            {task.projectName || 'No Projects Assigned'}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={projectAnchorEl}
            keepMounted
            open={Boolean(projectAnchorEl)}
            onClose={this.handleProjectMenuClose}
          >
            {
              projects &&
              projects.map((project, index) => (
                <MenuItem
                  key={`${project.id}${index}`}
                  onClick={() => this.handleProjectMenuClick(project.name, project.id)}
                >
                  {project.name}
                </MenuItem>
              ))
            }
          </Menu>
        </Grid>
      </WithLabel>
    )

    const taskDescription = task && (
      <WithLabel
        label='Task Description'
        show={!edit}
      >
        <DisplayEdit
          edit={edit}
          displayValue={task.description}
          component={FieldTextField}
          fieldProps={{
            name: 'description',
            label: 'Description',
            variant: 'outlined',
            style: {
              marginRight: '20px'
            }
          }}
          componentProps={{
            multiline: true,
            rowsMax: '4',
            rows: '4',
            formControlProps: {
              fullWidth: true,
            }
          }}
          textProps={{
            className: classes.descriptionField
          }}
        />
      </WithLabel>
    )

    // console.log('task: ', task);

    const showPictures = task && (
      <WithLabel
        label='Attachments'
      >

            <Grid>
              {
                pictures && pictures.length !== 0 || picturesAsFile && picturesAsFile.length !== 0
                  ?
                  <DisplayPictures
                    edit={edit}
                    pictures={this.props.pictures && this.props.pictures.concat(this.props.picturesAsFile)}
                    removePictureItem={this.props.handleRemovePictures}
                  />
                  :
                  <Grid>
                    <Typography>
                      No Attachments
                    </Typography>
                  </Grid>
              }
              {
                edit &&
                <Field
                  name='picturesAsFile'
                  component={UploadPicture}
                  label='Upload Picture'
                  type='file'
                  onChange={this.handleEditAddPicture}
                />
              }
            </Grid>
      </WithLabel>
    )


    const addNewTask = (
      <React.Fragment>
        <AppBar
          color='primary'
          position='static'
        >
          <Toolbar>
            <Typography variant='h4' color='inherit'>
              Create A New Task
            </Typography>
          </Toolbar>
        </AppBar>
        <AddNewTaskForm
          users={users}
          gridProps={{
            item: true,
            xs: 8,
            justify: 'space-around',
            alignItems: 'center'
          }}
          handleAddPicture={this.handleEditAddPicture}
          removePictureItem={this.props.handleRemovePictures}
          emptyPicturesArray={this.emptyPicturesArray}
          picturesAsFile={this.props.picturesAsFile}
        />
      </React.Fragment>
    )

    return (
      <Drawer
        anchor='top'
        open={taskDrawerOpen}
        onClose={this.handleCloseDrawer}
        classes={{
          paper: classes.container
        }}
      >
        <DialogComponent
          open={this.state.open}
          handleClose={this.handleClose}
          handleAgree={this.onDeleteHandler}
          title='Warning'
          text='Are you sure you want to delete this project?'
        />
        {
          task ?
          <form onSubmit={this.handleSubmit}>

            <AppBar position="static" color="primary">
              <Toolbar>
                <Grid
                  container={true}
                  direction='row'
                  justify='space-between'
                  alignItems='center'
                >
                  <DisplayEdit
                    edit={edit}
                    displayValue={task.title}
                    component={FieldTextField}
                    fieldProps={{
                      name: 'title',
                      label: 'Title',
                      style: {
                        color: 'white'
                      }
                    }}
                    textProps={{
                      variant: 'h5',
                    }}
                  />
                  <Grid
                    item={true}
                  >
                    <Grid
                      container={true}
                      direction='row-reverse'
                    >
                      <IconButton onClick={this.toggleEdit}>
                        <FontAwesomeIcon
                          icon={edit ? 'times' : 'edit'}
                          size='1x'
                        />
                      </IconButton>
                      <IconButton
                        onClick={this.handleClickOpen}
                        style={{color: 'white'}}
                      >
                        <FontAwesomeIcon
                          icon='trash'
                          size='1x'
                        />
                      </IconButton>
                    </Grid>

                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
            <Grid
              container={true}
              direction='row'
              className={classes.drawerBodyContainer}
              justify='space-between'
            >
              <Grid
                item={true}
                xs={8}
              >
                <Grid
                  container={true}
                  direction='column'
                >
                  {taskStatus}

                  {taskProject}

                  {taskDescription}

                  {showPictures}
                </Grid>
              </Grid>
              <Grid
                item={true}
                xs={4}
              >
                <Grid
                  container={true}
                  direction='column'
                  alignItems='flex-start'
                >
                  <WithLabel label='Assigned To'>
                    <DisplayEdit
                      edit={edit}
                      displayValue={fullName}
                      component={FieldReactSelect}
                      fieldProps={{
                        name: 'assignedTo',
                      }}
                      componentProps={{
                        label: 'Assigned To',
                        onChange: (e) => console.log(e),
                        isMulti: false,
                        options: users.filter((user, index) => user && (user.signedUpBy === loggedInUserId || user.id === loggedInUserId)).map(user => ({
                          label: [user.firstName, user.lastName].join(' '),
                          value: user.id,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          id: user.id
                        }))
                      }}
                    />
                  </WithLabel>

                  <WithLabel label='Created Date'>
                    <Typography inline={true} variant='body2' color='inherit'>{this.formatStringDate(task.createdDate)}</Typography>
                  </WithLabel>

                  <WithLabel label='Due Date' show={!edit}>
										<DisplayEdit
											edit={edit}
											displayValue={this.formatStringDate(task.dueDate)}
											component={FieldDatePicker}
											fieldProps={{
                        name: 'dueDate',
                        label: 'Change Task Due Date'
                      }}
										/>
                  </WithLabel>

									<WithLabel label='Created By'>
										<Typography inline={true} color='inherit' variant='body2'>{this.getCreatedByName()}</Typography>
                  </WithLabel>

                </Grid>
							</Grid>
            </Grid>

            <Grid
              container={true}
              direction='row-reverse'
              className={classes.buttonsFooter}
            >
              {
              edit &&
               <Button variant='outlined' type='submit' color='secondary'>
                  Submit the edit
                </Button>
              }
            </Grid>

          </form>
            : <Grid>{addNewTask}</Grid>
        }
      </Drawer>
    );
  }
}

const mapStateToProps = (state: any) => {
  const selectedTaskId = makeSelectSelectedTask()(state);

  const {
    taskDrawerOpen,
    task,
    projects,
    users,
    loggedInUserId
  } = createStructuredSelector({
    taskDrawerOpen: makeSelectTaskDrawerOpen(),
    task: makeSelectDataById('tasks', selectedTaskId),
    projects: makeSelectFirestoreOrderedData('projects'),
    users: makeSelectFirestoreOrderedData('users'),
    loggedInUserId: makeSelectLoggedInUserId()
  })(state);

  return {
    selectedTaskId,
    taskDrawerOpen,
    task,
    projects,
    users,
    loggedInUserId,
    createdByUser: task && makeSelectDataById('users', task.createdBy)(state)
  }
};

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => {
  return {
    closeDrawer: () => {
      dispatch(closeTaskDrawerAction())
    },
    changeTaskProject: (projectName, projectId) => {
      dispatch(ChangeTaskProjectAction(projectName, projectId))
    },
    changeTaskStatus: (taskId, status) => {
      dispatch(ChangeTaskStatusAction(taskId, status))
    },
    deleteTask: (id) => {
      dispatch(DeleteTaskAction(id))
    }
  };
}

export default compose<React.ComponentClass<ITaskDrawerComponentProps>>(
  reduxForm({
    form: 'editProject'
  }),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(TaskDrawer);
