


const defaultNamespace: string = 'oar';
const statePrefix: string = 'is-';


const _bem = (namespace: string, block: string, blockSuffix: string, element: string, modifier: string): string => {
    let cls = `${namespace}-${block}`

    if (blockSuffix) {
        cls += `-${blockSuffix}`
    }
    if (element) {
        cls += `__${element}`
    }
    if (modifier) {
        cls += `--${modifier}`
    }
    return cls;
}

/**
 * useNamespace
 * 用于生成符合 BEM 命名规范的类名工具函数，统一管理命名空间。
 *
 * @param block - 组件的块名
 * @returns 包含 b、e、m、em、is 方法的对象
 *   - b(blockSuffix): 生成块或块后缀类名
 *   - e(element): 生成元素类名
 *   - m(modifier): 生成修饰符类名
 *   - em(element, modifier): 生成元素+修饰符类名
 *   - is(name, isValue): 生成状态类名（如 is-active）
 */
export function useNamespace(block: string) {
    return {
        b: (blockSuffix: string = '') => _bem(defaultNamespace, block, blockSuffix, '', ''),
        e: (element?: string) => element ? _bem(defaultNamespace, block, '', element, '') : '',
        m: (modifier?: string) => modifier ? _bem(defaultNamespace, block, '', '', modifier) : '',
        em: (element: string, modifier: string) => _bem(defaultNamespace, block, '', element, modifier),

        is: (name: string, isValue: boolean) => {

            return name && isValue ? statePrefix + name : ''
        }
    }
}
