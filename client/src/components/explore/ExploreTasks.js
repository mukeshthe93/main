import React, { useEffect, useState, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllTasks } from '../../actions/taskAction';
import { getTasksCount } from '../../actions/taskAction';
import { dateEpx } from '../../actions/taskAction';
import {
  toggleLike,
  doExplore,
  sendProposal,
  fetchPendingProposals,
} from '../../actions/taskAction';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import FilterMenu from './filters/FilterMenu';
import { Input } from 'reactstrap';
import '../../style/task.css';
import FeedCard from './subs/FeedCard';
import TaskCard from './subs/TaskCard';
import TaskDetails from './subs/TaskDetails';
import ProposalForm from './subs/ProposalForm';
import ShareTasksPopup from './subs/ShareTasksPopup';
import 'quill/dist/quill.snow.css';
import TaskCardSkeleton from '../task/subs/TaskCardSkeleton';
import FilterInfo from './filters/FilterInfo';
import cloneDeep from 'lodash/cloneDeep';
import MetaTags from 'react-meta-tags';

class ExploreTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNo: 1,
      current_segment: 0,
      segment_size: 8,
      search_query: '',
      sort_by: -1,
      skills_filter: [],
      location_filter: [],
      category_filter: [],
      first_time: true,
      detail_popup_is_open: false,
      selected_task: 0,
      proposal_popup_is_open: false,
      proposal_text: '',
      proposal_loading: false,
      fetching_tasks: false,
      isEndReached: false,
      filter_info: {},
      share_popup_is_open: false,
      task_payload: {
        task_url: '',
        task_headline: '',
        from: '',
      },
    };
  }

  componentDidMount() {
    this.updateFeed(false);
    this.props.fetchPendingProposals();
    //console.log(filters);
    //document.addEventListener('scroll', this.trackScrolling);
  }
  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  task_detail_toggle = () => {
    this.setState({
      detail_popup_is_open: !this.state.detail_popup_is_open,
    });
  };

  proposal_toggle = () => {
    this.setState({
      proposal_popup_is_open: !this.state.proposal_popup_is_open,
    });
  };
  trackScrolling = () => {
    const wrappedElement = document.getElementById('explore-container');
    if (this.isBottom(wrappedElement)) {
      document.removeEventListener('scroll', this.trackScrolling);
      this.updateFeed();
    }
  };

  isBottom = (el) => {
    if (el && el.getBoundingClientRect()) {
      return el.getBoundingClientRect().bottom <= window.innerHeight;
    } else return false;
  };

  updateFeed = (shouldAppend = true) => {
    console.log('update called');
    if (shouldAppend && this.state.isEndReached) {
      return false;
    }
    let filters = this.fetchFilters();
    const flti = {
      sq: this.state.search_query,
      cf: cloneDeep(this.state.category_filter),
      sf: cloneDeep(this.state.skills_filter),
    };
    this.setState(
      {
        fetching_tasks: true,
        filter_info: flti,
      },
      () => {
        this.props
          .doExplore(filters, shouldAppend)
          .then((fetched_tasks) => {
            if (fetched_tasks.length < 8) {
              this.setState({
                isEndReached: true,
              });
            }
            this.setState({
              current_segment: this.state.current_segment + 1,
            });
          })
          .then(() => {
            this.setState({
              fetching_tasks: false,
            });
            document.addEventListener('scroll', this.trackScrolling);
          });
      }
    );
  };

  fetchFilters = () => {
    const explored_filters = {
      c: this.state.current_segment,
      z: this.state.segment_size,
      s: this.state.search_query,
      r: this.state.sort_by,
      k: JSON.stringify(this.state.skills_filter),
      l: this.state.location_filter,
      i: JSON.stringify(this.state.category_filter),
    };
    return explored_filters;
  };

  onSearch = (e) => {
    if (e.target.value === '') {
      this.setState(
        {
          current_segment: 0,
          isEndReached: false,
        },
        () => {
          this.updateFeed(false);
        }
      );
    }
    this.setState({
      search_query: e.target.value,
    });
  };

  onEnterPress = (e) => {
    if (e.key === 'Enter') {
      this.setState(
        {
          current_segment: 0,
        },
        () => {
          this.updateFeed(false);
        }
      );
    }
  };

  onTaskSelect = (task_id) => {
    this.setState({ selected_task: task_id }, () => {
      this.task_detail_toggle();
    });
  };

  share_toggle = () => {
    this.setState({
      share_popup_is_open: !this.state.share_popup_is_open,
    });
  };
  onTaskShare = (payload = {}) => {
    console.log(payload);
    this.setState(
      {
        task_payload: payload,
      },
      () => {
        this.share_toggle();
      }
    );
  };
  changeProposalText = (t) => {
    if (t) {
      this.setState({
        proposal_text: t.target.value,
      });
    } else {
      this.setState({
        proposal_text: '',
      });
    }
  };

  sendProposal = () => {
    const payload = {
      text: this.state.proposal_text,
      task_id: this.state.selected_task,
    };
    this.setState(
      {
        proposal_loading: true,
      },
      () => {
        this.props.sendProposal(payload).then(() => {
          this.setState({
            proposal_popup_is_open: false,
            proposal_text: '',
            proposal_loading: false,
          });
        });
      }
    );
  };

  onCategoryFilter = (e) => {
    if (!this.state.category_filter.includes(e.target.value)) {
      this.state.category_filter.push(e.target.value);
      this.setState({
        category_filter: this.state.category_filter,
      });
    } else {
      this.state.category_filter.splice(
        this.state.category_filter.indexOf(e.target.value),
        1
      );
      this.setState({
        category_filter: this.state.category_filter,
      });
    }
  };

  onCategoryFilterClear = () => {
    this.setState(
      {
        category_filter: [],
      },
      () => {
        this.onCategoryFilterApply();
      }
    );
  };

  onCategoryFilterApply = () => {
    this.setState(
      {
        current_segment: 0,
        isEndReached: false,
      },
      () => {
        this.updateFeed(false);
      }
    );
  };

  onSkillsFilter = (e) => {
    if (!this.state.skills_filter.includes(e.target.value)) {
      this.state.skills_filter.push(e.target.value);
      this.setState({
        skills_filter: this.state.skills_filter,
      });
    } else {
      this.state.skills_filter.splice(
        this.state.skills_filter.indexOf(e.target.value),
        1
      );
      this.setState({
        skills_filter: this.state.skills_filter,
      });
    }
  };

  onSkillsFilterClear = () => {
    this.setState(
      {
        skills_filter: [],
      },
      () => {
        this.onSkillsFilterApply();
      }
    );
  };

  onSkillsFilterApply = () => {
    this.setState(
      {
        current_segment: 0,
        isEndReached: false,
      },
      () => {
        this.updateFeed(false);
      }
    );
  };

  resetFilters = () => {
    this.setState(
      {
        category_filter: [],
        skills_filter: [],
        search_query: '',
        current_segment: 0,
        isEndReached: false,
      },
      () => {
        this.updateFeed(false);
      }
    );
  };

  render() {
    const allTasks = this.props.task.tasks;
    return (
      <div>
        <FilterMenu
          onCategoryFilter={this.onCategoryFilter}
          category_filter={this.state.category_filter}
          onCategoryFilterClear={this.onCategoryFilterClear}
          onCategoryFilterApply={this.onCategoryFilterApply}
          onSkillsFilter={this.onSkillsFilter}
          skills_filter={this.state.skills_filter}
          onSkillsFilterClear={this.onSkillsFilterClear}
          onSkillsFilterApply={this.onSkillsFilterApply}
        />
        <div className='container explore-container' id='explore-container'>
          <div className='search-container'>
            <Input
              type='search'
              name='search'
              id='exampleSearch'
              placeholder='search tasks'
              className='task-search-box'
              value={this.state.search_query}
              onChange={this.onSearch}
              onKeyPress={this.onEnterPress}
            />
          </div>

          <div className='task-list-section'>
            <div className='task-list-title'>Top new jobs on Taskbarter</div>

            <FilterInfo
              filter_info={this.state.filter_info}
              onClear={this.resetFilters}
            />

            <div className='task-list-container'>
              <FeedCard />
              {allTasks &&
                allTasks.map((task, i) => (
                  <TaskCard
                    task={task}
                    key={i}
                    onClick={this.onTaskSelect}
                    share_toggle={this.share_toggle}
                    onTaskShare={this.onTaskShare}
                    pending_proposals={this.props.pending_proposals}
                  />
                ))}

              {this.state.fetching_tasks ? (
                <React.Fragment>
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                </React.Fragment>
              ) : (
                ''
              )}
            </div>
            {this.state.isEndReached ? (
              <div className='end-explore'>End of feed</div>
            ) : (
              ''
            )}
          </div>
        </div>
        <TaskDetails
          toggle={this.task_detail_toggle}
          modal={this.state.detail_popup_is_open}
          selected_task={this.state.selected_task}
          proposal_toggle={this.proposal_toggle}
          current_user={this.props.auth.user.id}
          onTaskShare={this.onTaskShare}
          pending_proposals={this.props.pending_proposals}
        />
        <ProposalForm
          toggle={this.proposal_toggle}
          modal={this.state.proposal_popup_is_open}
          selected_task={this.state.selected_task}
          proposal_text={this.state.proposal_text}
          changeProposalText={this.changeProposalText}
          sendProposal={this.sendProposal}
          proposalLoading={this.state.proposal_loading}
        />
        <ShareTasksPopup
          toggle={this.share_toggle}
          modal={this.state.share_popup_is_open}
          task={this.state.task_payload}
        />{' '}
        <MetaTags>
          <title>Explore Tasks | Taskbarter</title>
        </MetaTags>
      </div>
    );
  }
}

ExploreTasks.propTypes = {
  task: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getAllTasks: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  getTasksCount: PropTypes.func.isRequired,
  doExplore: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  task: state.task,
  auth: state.auth,
  pending_proposals: state.task.pending_proposals,
});

export default connect(mapStateToProps, {
  getAllTasks,
  toggleLike,
  getTasksCount,
  doExplore,
  sendProposal,
  fetchPendingProposals,
})(ExploreTasks);
