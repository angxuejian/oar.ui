import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import AudioRecorder from '../src/index.vue'

// --- Mock 数据 ---
function mockStream() {
  return {
    getTracks: () => [{ stop: vi.fn() }],
  } as any
}

function mockDataUrl() {
  return new Blob(['dummy-webm-data'], { type: 'audio/webm' })
}

// --- 全局 Mock 设置 ---
let scriptProcessorParams: any = null

function setupMocks() {
  scriptProcessorParams = null

  // 1. getUserMedia
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockResolvedValue(mockStream()),
    },
    writable: true,
  })

  // 2. MediaRecorder
  class MockMediaRecorder {
    state = 'inactive'
    ondataavailable: any = null
    onstop: any = null
    constructor(stream: any, options: any) {}
    start() {
      this.state = 'recording'
    }
    stop() {
      this.state = 'inactive'
      if (this.ondataavailable) {
        this.ondataavailable({ data: mockDataUrl() })
      }
      if (this.onstop) {
        this.onstop()
      }
    }
  }
  // @ts-ignore
  global.MediaRecorder = MockMediaRecorder

  // 3. AudioContext & Nodes
  class MockAnalyser {
    fftSize = 256
    frequencyBinCount = 128
    getByteFrequencyData(arr: Uint8Array) {
      arr.fill(50)
    }
    connect() {}
    disconnect() {}
  }

  class MockScriptProcessor {
    bufferSize: number
    constructor(bufferSize: number) {
      this.bufferSize = bufferSize
      scriptProcessorParams = this
    }
    connect() {}
    disconnect() {}
    onaudioprocess: ((event: any) => void) | null = null
  }

  class MockAudioContext {
    state = 'running'
    sampleRate = 48000
    createMediaStreamSource() {
      return { connect: vi.fn(), disconnect: vi.fn() }
    }
    createAnalyser() {
      return new MockAnalyser()
    }
    createScriptProcessor(bufferSize: number, inputChannels: number, outputChannels: number) {
      return new MockScriptProcessor(bufferSize)
    }
    createGain() {
      return {
        gain: { value: 1 },
        connect: vi.fn(),
        disconnect: vi.fn(),
      }
    }
    createBuffer(channels: number, length: number, sampleRate: number) {
      return {
        numberOfChannels: channels,
        length: length,
        sampleRate: sampleRate,
        getChannelData: () => new Float32Array(length),
      }
    }
    resume() { return Promise.resolve() }
    close() { return Promise.resolve() }
  }

  // @ts-ignore
  global.AudioContext = MockAudioContext
  // @ts-ignore
  global.window.AudioContext = MockAudioContext
  // @ts-ignore
  global.window.webkitAudioContext = MockAudioContext

  // 4. Canvas Mock
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    setTransform: vi.fn(),
    scale: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
  }) as any
}

describe('AudioRecorder.vue', () => {
  // 定义 wrapper 变量，方便在 afterEach 中清理
  let wrapper: VueWrapper<any> | null = null

  beforeEach(() => {
    vi.useFakeTimers()
    setupMocks()
    // 重置 body 内容
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // 关键修复：每次测试后销毁组件，防止 DOM 残留导致 insertBefore 错误
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
    vi.clearAllMocks()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('should render base container class', () => {
    wrapper = mount(AudioRecorder)
    expect(wrapper.classes()).toContain('oar-audio-recorder')
  })

  it('should start pressing after pressDelay', async () => {
    wrapper = mount(AudioRecorder, {
      props: { pressDelay: 200 },
      attachTo: document.body // 推荐加上，虽然这个测试不加可能也能过
    })

    const trigger = wrapper.find('.oar-audio-recorder__trigger')
    await trigger.trigger('mousedown')

    expect(wrapper.vm.isPressing).toBe(false)

    vi.advanceTimersByTime(200)
    expect(wrapper.vm.isPressing).toBe(true)
  })

  it('should show popup when pressing', async () => {
    // 关键修复：使用 attachTo: document.body
    // 这样 Teleport 才能正确找到父节点，避免 insertBefore null 错误
    wrapper = mount(AudioRecorder, {
      props: { pressDelay: 200 },
      attachTo: document.body
    })

    await wrapper.find('.oar-audio-recorder__trigger').trigger('mousedown')
    vi.advanceTimersByTime(200)
    await wrapper.vm.$nextTick()

    // 因为用了 attachTo: document.body，我们可以直接在 body 里查
    const popup = document.body.querySelector('.oar-audio-recorder-popup')
    expect(popup).not.toBeNull()
  })

  it('should stop recording after mouseup', async () => {

    wrapper = mount(AudioRecorder, {
      props: { pressDelay: 200 },
      attachTo: document.body
    })

    // 1. 开始录音
    await wrapper.find('.oar-audio-recorder__trigger').trigger('mousedown')
    vi.advanceTimersByTime(200)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isRecording).toBe(true)

    // 2. 触发全局 mouseup
    window.dispatchEvent(new MouseEvent('mouseup'))

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isRecording).toBe(false)
  })

  it('should emit cancel on unexpected cancel', async () => {
    wrapper = mount(AudioRecorder, {
      props: { pressDelay: 200 },
      attachTo: document.body
    })

    await wrapper.find('.oar-audio-recorder__trigger').trigger('mousedown')
    vi.advanceTimersByTime(200)

    await wrapper.find('.oar-audio-recorder__trigger').trigger('touchcancel')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('should emit error if getUserMedia fails', async () => {
    const getUserMediaMock = vi.fn().mockRejectedValue(new Error('NotAllowedError'))
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      value: getUserMediaMock,
      writable: true
    })

    wrapper = mount(AudioRecorder, { attachTo: document.body })

    await wrapper.find('.oar-audio-recorder__trigger').trigger('mousedown')
    vi.advanceTimersByTime(200)

    await new Promise(process.nextTick)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('error')).toBeTruthy()
  })

  it('should emit change() with Blob when recording ends (webm)', async () => {
    wrapper = mount(AudioRecorder, { attachTo: document.body })

    await wrapper.find('.oar-audio-recorder__trigger').trigger('mousedown')
    vi.advanceTimersByTime(200)
    await wrapper.vm.$nextTick()

    window.dispatchEvent(new MouseEvent('mouseup'))
    await wrapper.vm.$nextTick()

    const evt = wrapper.emitted('change')
    expect(evt).toBeTruthy()
    expect(evt![0][0]).toBeInstanceOf(Blob)
  })

  it('should emit change() with ArrayBuffer in pcm16 mode', async () => {
    wrapper = mount(AudioRecorder, {
      props: { pcm16: true },
      attachTo: document.body
    })

    await wrapper.find('.oar-audio-recorder__trigger').trigger('mousedown')
    vi.advanceTimersByTime(200)
    await wrapper.vm.$nextTick()

    // 模拟 PCM 数据处理
    if (scriptProcessorParams && scriptProcessorParams.onaudioprocess) {
      const mockInputBuffer = {
        getChannelData: () => new Float32Array(4096).fill(0.5),
        numberOfChannels: 1,
        sampleRate: 48000
      }
      scriptProcessorParams.onaudioprocess({ inputBuffer: mockInputBuffer })
    }

    window.dispatchEvent(new MouseEvent('mouseup'))
    await wrapper.vm.$nextTick()

    const evt = wrapper.emitted('change')
    expect(evt).toBeTruthy()
    expect(evt![0][0]).toBeInstanceOf(ArrayBuffer)
  })
})
