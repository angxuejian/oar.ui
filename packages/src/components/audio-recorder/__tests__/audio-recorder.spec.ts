import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import AudioRecorder from '../src/index.vue'

function mockStream() {
  return {
    getTracks: () => [{ stop: vi.fn() }],
  } as any
}

function mockDataUrl() {
  return new Blob(['dummy'], { type: 'audio/webm' })
}

function setupMocks() {
  // ---- getUserMedia ----
  navigator.mediaDevices = {
    getUserMedia: vi.fn().mockResolvedValue(mockStream()),
  } as any

  // ---- MediaRecorder ----
  class MockMediaRecorder {
    state = 'inactive'
    ondataavailable: any = null
    onstop: any = null
    constructor() {}
    start() {
      this.state = 'recording'
    }
    stop() {
      this.state = 'inactive'
      if (this.ondataavailable) {
        this.ondataavailable({ data: mockDataUrl() })
      }
      if (this.onstop) this.onstop()
    }
  }
  // @ts-ignore
  global.MediaRecorder = MockMediaRecorder

  // ---- AudioContext & AnalyserNode（避免真实执行） ----
  class MockAnalyser {
    fftSize = 256
    frequencyBinCount = 128
    getByteFrequencyData(arr: Uint8Array) {
      arr.fill(10) // 固定值，避免真实波形
    }
    connect() {}
    disconnect() {}
  }

  class MockAudioContext {
    constructor() {
      this.currentTime = 0
      this.sampleRate = 48000
      this.state = 'running'
      this.destination = {}
      this.onstatechange = null
    }
    createMediaStreamSource() {
      return { connect: vi.fn(), disconnect: vi.fn() }
    }
    createAnalyser() {
      return new MockAnalyser()
    }
    createScriptProcessor() {
      return {
        connect: vi.fn(),
        disconnect: vi.fn(),
        onaudioprocess: null,
      }
    }
    createGain() {
      return {
        gain: { value: 1 },
        connect: vi.fn(),
        disconnect: vi.fn(),
      }
    }
    resume() {}
    close() {}
  }

  // @ts-ignore
  global.AudioContext = MockAudioContext

  // ---- CanvasRenderingContext2D ----
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    setTransform: vi.fn(),
    scale: vi.fn(),
  })
}

describe('AudioRecorder.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setupMocks()

    // Teleport 需要 body
    document.body.innerHTML = `<div id="app"></div>`
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should render base container class', () => {
    const wrapper = mount(AudioRecorder)
    expect(wrapper.classes()).toContain('oar-audio-recorder')
  })

  it('should start pressing after pressDelay', async () => {
    const wrapper = mount(AudioRecorder, {
      props: { pressDelay: 200 },
    })

    const trigger = wrapper.find('.oar-audio-recorder__trigger')
    await trigger.trigger('mousedown')

    expect(wrapper.vm.isPressing).toBe(false)

    vi.advanceTimersByTime(200)
    expect(wrapper.vm.isPressing).toBe(true)
  })

  it('should show popup when pressing', async () => {
    const wrapper = mount(AudioRecorder, {
      props: { pressDelay: 200 },
    })

    await wrapper.find('.oar-audio-recorder__trigger').trigger('mousedown')
    vi.advanceTimersByTime(200)

    await wrapper.vm.$nextTick()

    const popup = document.body.querySelector('.oar-audio-recorder-popup')
    expect(popup).not.toBeNull()
  })

  // it('should stop recording after mouseup', async () => {
  //   const wrapper = mount(AudioRecorder, {
  //     props: { pressDelay: 200 },
  //   })

  //   const trigger = wrapper.find('.oar-audio-recorder__trigger')

  //   await trigger.trigger('mousedown')
  //   vi.advanceTimersByTime(200)
  //   await wrapper.vm.$nextTick()

  //   expect(wrapper.vm.isRecording).toBe(true)

  //   window.dispatchEvent(new MouseEvent('mouseup'))
  //   await wrapper.vm.$nextTick()
  //   console.log(wrapper.vm.isRecording, ':::::::::::::::::::')
  //   expect(wrapper.vm.isRecording).toBe(false)
  // })

  it('should emit cancel on unexpected cancel', async () => {
    const wrapper = mount(AudioRecorder, {
      props: { pressDelay: 200 },
    })

    const trigger = wrapper.find('.oar-audio-recorder__trigger')

    await trigger.trigger('mousedown')
    vi.advanceTimersByTime(200)

    await wrapper.find('.oar-audio-recorder__trigger').trigger('touchcancel')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('should emit error if getUserMedia fails', async () => {
    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue('denied')

    const wrapper = mount(AudioRecorder)

    const trigger = wrapper.find('.oar-audio-recorder__trigger')
    await trigger.trigger('mousedown')
    vi.advanceTimersByTime(200)

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('error')).toBeTruthy()
  })

  // it('should emit change() with Blob when recording ends (webm)', async () => {
  //   const wrapper = mount(AudioRecorder)

  //   const trigger = wrapper.find('.oar-audio-recorder__trigger')

  //   await trigger.trigger('mousedown')
  //   vi.advanceTimersByTime(200)

  //   window.dispatchEvent(new MouseEvent('mouseup'))

  //   const evt = wrapper.emitted('change')
  //   expect(evt).toBeTruthy()
  //   expect(evt![0][0]).toBeInstanceOf(Blob)
  // })

  // it('should emit change() with ArrayBuffer in pcm16 mode', async () => {
  //   const wrapper = mount(AudioRecorder, {
  //     props: { pcm16: true },
  //   })

  //   const trigger = wrapper.find('.oar-audio-recorder__trigger')

  //   await trigger.trigger('mousedown')
  //   vi.advanceTimersByTime(200)

  //   // await trigger.trigger('mouseup')

  //   const evt = wrapper.emitted('change')
  //   expect(evt).toBeTruthy()
  //   expect(evt![0][0]).toBeInstanceOf(ArrayBuffer)
  // })

  it('should render trigger slot', () => {
    const wrapper = mount(AudioRecorder, {
      slots: {
        trigger: '<button>Tap me</button>',
      },
    })

    expect(wrapper.text()).toContain('Tap me')
  })
})
