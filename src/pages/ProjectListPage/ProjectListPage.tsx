import * as React from 'react';
import {
  Grid, Paper,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import {
  StyleRules
} from '@material-ui/core/styles';
import {
  compose,
} from 'redux';
import {List, Map} from 'immutable';
import {connect} from "react-redux";
import {createProject, doTheThingAction, FirstAction, GetProjectsAction} from "../../store/action";
import {makeSelectProjects, makeSelectProjectTitle} from "../../store/selectors";
import {createStructuredSelector} from "reselect";
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

const styles = (theme: Theme): StyleRules => ({
  root: {},
  paperContainer: {
    padding: '16px'

  }
});

interface IProjectListPageComponentProps {
  projects: any;
}

//from state
interface IProjectListPageProps extends IProjectListPageComponentProps {
  getProjects(): void;
}

type ProjectListPageType = IProjectListPageProps & WithStyles<keyof ReturnType<typeof styles>>;

class ProjectListPage extends React.Component<ProjectListPageType, {}> {
  public state = {
    columns: [
      {title: 'Name', field: 'name'},
      {title: 'Project Phase', field: 'projectPhase'},
      {title: 'Status', field: 'status'},
      {title: 'Sprint', field: 'sprint'},
    ],
    data: [
      {
        name: 'Project 1',
        projectPhase: 'beginning',
        status: 'to do',
        sprint: 1,
      },
      {
        name: 'Project 2',
        projectPhase: 'mid',
        status: 'in progress',
        sprint: 4,
      }
    ]
  }

  private columns = [
    {title: 'Name', field: 'name'},
    {title: 'Project Phase', field: 'projectPhase'},
    {title: 'Status', field: 'status'},
    {title: 'Sprint', field: 'sprint'},
  ]

  public getData = () => {
    const {
      projects
    } = this.props;

    console.log('=============')
    const data = projects.map(project => {
      // console.log('project: ', project.toJS())
      return Map().withMutations(item => {
        this.columns.forEach(columnType => {
          const filedName = columnType['field']
          // console.log('filedName: ', filedName);
          // console.log('project.get(filedName): ', project.get(filedName));
          item.set(filedName, project.get(filedName))
          // console.log('item: ', item);
        })
      })
    });

    //
    // const john = projects.toJS().map( project => {
    //   let item = {};
    //   this.columns.map ( columnType => {
    //     const fieldName = columnType['field']
    //     item[fieldName] = project[fieldName]
    //   })
    //   return item;
    // })
    // console.log(john);
    //
    console.log(data.toJS())
    return data.toJS();
  }

  componentDidMount() {
    this.props.getProjects();
  }


  render() {
    const {
      classes,
      projects
    } = this.props;

    const {
      columns,
      data
    } = this.state;

    console.log(this.props.projects);

    return (
      <MaterialTable
        title="All Projects"
        columns={this.columns}
        data={this.getData()}
        editable={{
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const dataPlm = [...data];
                dataPlm.splice(dataPlm.indexOf(oldData), 1);
                this.setState({...this.state, dataPlm});
              }, 600);
            }),
        }}
        actions={[
          {
            icon: 'bookmark',
            tooltip: 'Save Project',
            onClick: () => {
              console.log('trag la buci lu ma-ta');
            }
          }
        ]}
      />
    );
  }
}

const mapStateToProps = (state: any) => {
  return createStructuredSelector({
    projects: makeSelectProjects(),
  })(state)
}

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => {
  return {
    getProjects: () => {
      dispatch(GetProjectsAction())
    }
  };
}

export default compose<React.ComponentClass<IProjectListPageComponentProps>>(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(ProjectListPage);