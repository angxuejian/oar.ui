import { createVNode, render } from 'vue';
import MessageComponent from './index.vue';


let seed = 1
const BASE_TOP = 20
const BASE_MARGIN_BOTTOM = 16
const instances = []

const message = options => {
  const instance = createMessage(options)

  instances.push(instance)
  return instance.handler
}

const createMessage = options => {
  const id = `message_${seed++}`
  const container = document.createElement('div')

  const props = {
    ...options,
    id,
    closeMsg: () => {
      calcMessageEndOffsetTop(instance)
    },
    destoryMsg: () => {
      render(null, container)
    }
  }

  const vnode = createVNode(MessageComponent, props)
  render(vnode, container)
  document.body.appendChild(container.firstElementChild)

  const vm = vnode.component
  const handler = {
    close: () => {
      vm.exposed.close()
    }
  }
  vm.exposed.setOffsetTopValue(calcMessageStartOffsetTop())
  const instance = {
    id, vnode, vm, handler, props: vnode.component.props
  }
  return instance
}

const calcMessageStartOffsetTop = () => {
  let offset = BASE_TOP

  instances.forEach(item => {
    offset += item.vnode.el.offsetHeight + BASE_MARGIN_BOTTOM
  })

  return offset
}

const calcMessageEndOffsetTop = instance => {
  const index = instances.indexOf(instance)
  if (index === -1) return

  const length = instances.length
  const currentMessageHeight = instances[index].vnode.el.offsetHeight
  instances.splice(index, 1)

 
  if (length <= 1 || index > instances.length - 1) return

  for (let i = index; i < length - 1; i++) {

    const el = instances[i].vnode.el
    const vm = instances[i].vm
    const itemMessageTop = parseInt(el.style['top'], 10)
    vm.exposed.setOffsetTopValue(itemMessageTop - currentMessageHeight - BASE_MARGIN_BOTTOM) 
  }
}

export default message
