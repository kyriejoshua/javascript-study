/******** 《JavaScript 高级程序设计》 ********/
/******** 16、HTML5 脚本编程 ********/

export default class Part15Canvas {
  constructor() {
    // 16.1 跨文档消息传递
    this.getMessage()

    // 16.2 原生拖放
    // 16.2.1 拖放事件
    // 拖动时
    // dragstart
    // drag 持续触发
    // dragend
    // 拖到一个有效目标时
    // dragenter
    // dragover 持续触发
    // dragleave

    // 16.2.2 自定义放置目标
    this.makeEleDraggabled()

    // 16.2.3 dataTransfer 对象
    // 事件对象的属性，用来传递字符串格式的数据

    // 16.2.4 dropEffect 与 effectAllowed

    // 16.2.5 可拖动
    // 图像和链接默认可拖动 文本需要选中才可拖动
    // HTML5 可以直接设置属性 draggable=true
    this.makeEleDraggable()


    // 16.3 媒体元素
    this.renderVideo()
    this.renderAudio()

    // 16.3.1 属性
    // 16.3.2 事件
    // 16.3.3 自定义媒体播放器
    this.renderMediaPlayer()
    this.handleMedia()

    // 16.3.4 检测编解码器的支持情况

    // 16.3.5 Audio 类型
    this.autoPlayAudio()

    // 16.4 历史状态管理
    history.pushState('index.html')
    history.replaceState('index.html')
    this.popstate()
  }

  /**
   * 获取收到的消息并发送回执
   */
  getMessage() {
    EventUtil.addHandle(window, 'message', function (event) {
      if (event.origin === 'http://...') {
        // handleMessage()
        event.source.postMessage('received', 'http://...')
      }
    })
  }

  /**
   * 所有元素都是支持放置事件的，但默认不可放置，这里手动禁用
   */
  makeEleDraggabled() {
    let dragTarget = document.querySelector('#dragTarget')

    EventUtil.addHandle(dragTarget, 'dragover', function (event) {
      EventUtil.preventDefault(event)
    })

    EventUtil.addHandle(dragTarget, 'dragenter', function (event) {
      EventUtil.preventDefault(event)
    })
  }

  /**
   * 使用 HTML5 的属性让元素可拖拽
   */
  makeEleDraggable() {
    let div = document.querySelector('#div')
    div.setAttribute('draggable', true)
  }

  renderVideo() {
    return <video src="video.mp4" id="myVideo">Video player is not supported!</video>
  }

  renderAudio() {
    return <audio src="audio.mp3" id="myAudio">Audio player is not supported!</audio>
  }

  /**
   * 自定义控制组件的播放
   */
  renderMediaPlayer() {
    return <div id="mediaplayer">
      <div className="video" >
        <video id="player" src="movie.mov" poster="movie.jpg" width="300" height="280">Video Player is not supported</video>
      </div>
      <div className="control">
        <input type="button" value="Play" id="video-btn"/>
        <span id="curtime">0</span><span id="duration">0</span>
      </div>
    </div>
  }

  /**
   * 添加事件控制视频的播放和暂停
   */
  handleMedia() {
    let video = document.querySelector('#player')
      btn = document.querySelector('#video-btn')
      curtime = document.querySelector('#curtime')
      duration = document.querySelector('#duration')

      // 总时长
      duration.innerHTML = video.duration
      EventUtil.addHandle(btn, 'click', function (event) {
        if (player.pause) {
          player.play()
          btn.value = 'Pause'
        } else {
          player.pause()
          btn.value = 'Play'
        }

        window.setInterval(function (params) {
          curtime.innerHTML = video.currentTime
        }, 250)
      })
  }


  /**
   * 构造函数的方式，直接生成 audio, 不需要插入文档，一旦创建就直接生成，开始下载
   * @param {String} src
   */
  createAudio(src = 'sound.mp3') {
    return new Audio(src)
  }

  /**
   * 下载后自动开始播放视频
   */
  autoPlayAudio() {
    let audio = this.createAudio()

    EventUtil.addHandle(audio, 'canplaythrough', function () {
      audio.play()
    })
  }

  popstate() {
    EventUtil.addHandle(window, 'popstate', function (event) {
      let state = event.state
      // 第一个页面 state 为 null, 当存在时，进行处理， processState 源自文章里的方法，但书中并没有找到定义的地方
      if (state) {
        processState(state)
      }
    })
  }
}
