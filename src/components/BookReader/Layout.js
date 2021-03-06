import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import AppBar from 'material-ui/AppBar';
import Slider from 'material-ui/Slider';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Sunny from 'material-ui/svg-icons/image/wb-sunny';
import FontSizeIcon from 'material-ui/svg-icons/editor/format-size';
import { Tabs, Tab } from 'material-ui/Tabs';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import LockIcon from 'material-ui/svg-icons/action/lock';
import ListIcon from 'material-ui/svg-icons/action/view-list';
import Moon from 'material-ui/svg-icons/image/brightness-3';
import Loading from './Loading';
import Back from '../../components/Layout/Back';
import styles from './Layout.less';
import { themes } from '../../utils/constant.js';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showChapterList: false,
      showSettings: false,
      brightness: 1,
      theme: 1,
      night: false,
    };
  }
  setTheme = (theme) => {
    this.props.dispatch({
      type: 'bookReader/setTheme',
      payload: { ...theme },
    });
  }
  setFontSize = (type) => {
    let fontSize = this.props.theme.fontSize || 16;
    if (type === 'reduce') {
      fontSize += 2;
    }
    if (type === 'increase') {
      fontSize -= 2;
    }
    this.setTheme({ fontSize });
  }
  showOrCloseHandler = (obj) => {
    this.setState({
      show: !this.state[obj],
      [obj]: !this.state[obj],
    });
  }
  changeChapterhandler = (obj) => {
    this.props.dispatch({
      type: 'bookReader/changeChapter',
      payload: { type: 'goto', obj },
    });
    this.showOrCloseHandler('showChapterList');
  }
  back = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/',
    }));
  }
  goToUrl = (pathname) => {
    this.props.dispatch(routerRedux.push({
      pathname,
    }));
  }
  setNight = () => {
    console.log(this.state.night);
    if (this.state.night) {
      this.setTheme({
        background: '#FAF9DE',
        color: 'rgba(0,0,0,0.7)',
      });
    } else {
      this.setTheme({
        background: '#000',
        color: 'rgba(255,255,255,0.5)',
      });
    }
    this.setState({ night: !this.state.night });
  }
  render() {
    const { children, chapterList, book, status } = this.props;
    const { show, showChapterList, showSettings, brightness, theme, night } = this.state;
    return (
      <div>
        <div className={`${styles.header} ${show ? '' : styles.headerhide}`}>
          <AppBar
            title={book.title}
            iconElementLeft={<Back />}
            iconElementRight={<FlatButton onClick={this.goToUrl.bind(this, 'source')} style={{ margin: 0 }} label="换源" />}
            onLeftIconButtonTouchTap={this.back}
          />
        </div>
        <div className={styles.body}>
          {status === 'loading' && <Loading theme={this.props.theme} />}
          {status === 'error' && <h1>error</h1>}
          {status === 'success' && children}
        </div>
        <div className={`${styles.foot} ${show ? '' : styles.foothide}`}>
          <Tabs>
            <Tab
              icon={night ? <Sunny /> : <Moon />}
              label={night ? '白天' : '夜间'}
              onClick={this.setNight}
            />
            {/* <Tab
              icon={<MapsPersonPin />}
              label="反馈"
            />*/}
            <Tab
              icon={<ListIcon />}
              label="目录"
              onClick={this.showOrCloseHandler.bind(this, 'showChapterList')}
            />
            {/* <Tab
              icon={<MapsPersonPin />}
              label="存缓"
            />*/}
            <Tab
              icon={<SettingsIcon />}
              label="设置"
              onClick={this.showOrCloseHandler.bind(this, 'showSettings')}
            />
          </Tabs>
        </div>
        <Dialog
          modal={false}
          open={showChapterList}
          onRequestClose={this.showOrCloseHandler.bind(this, 'showChapterList')}
          autoScrollBodyContent
        >
          {
            chapterList.chapters && chapterList.chapters.map((i, index) =>
              <p
                key={i.link}
                onClick={this.changeChapterhandler.bind(this, index)}
                style={(book.currentChapter || 0) === index ? { color: 'red' } : {}}
              >
                {i.title}
                {i.isVip && <LockIcon style={{ float: 'right', width: 14, color: '#789' }} />}
              </p>,
            )
          }
        </Dialog>
        <Dialog
          contentStyle={{
            width: '100%',
            bottom: 0,
          }}
          modal={false}
          open={showSettings}
          onRequestClose={this.showOrCloseHandler.bind(this, 'showSettings')}
          autoScrollBodyContent
        >
          <div className={styles.brightness}>
            <Sunny color="#848484" style={{ width: 15 }} />
            <Slider sliderStyle={{ margin: 0 }} style={{ width: '100%', margin: '0 10px' }} value={brightness} defaultValue={1} onChange={(e, i) => this.setState({ brightness: i })} />
            <Sunny color="#848484" />
          </div>
          <div className={styles.fontSize}>
            <IconButton onClick={this.setFontSize.bind(this, 'increase')} iconStyle={{ width: 18 }}>
              <FontSizeIcon color="#848484" />
            </IconButton>
            <IconButton onClick={this.setFontSize.bind(this, 'reduce')}>
              <FontSizeIcon color="#848484" />
            </IconButton>
          </div>
          <div className={styles.themeSelect}>
            {themes.map((i, index) => <span onClick={this.setTheme.bind(this, i)} className={theme === index && styles.active} key={i.background} style={{ ...i }} />)}
          </div>
        </Dialog>
        <div className={styles.mask} style={{ opacity: (1 - brightness) }} onClick={this.showOrCloseHandler.bind(this, 'show')} />
      </div>
    );
  }
}

export default Layout;
