import { MonacoEditorProps, MonacoEditorBaseProps } from 'react-monaco-editor';
import { Component } from 'react';

class Monaco extends Component<MonacoEditorBaseProps> {
    MonacoEditor: new () => Component<MonacoEditorProps> = require('react-monaco-editor').default;
    resizeTaskId: any = null;
    resizeListener: void;
    editor: unknown = null;
    storedDimensions = { width: window.innerWidth, height: window.innerHeight };

    handleResize = () => {
        let widthDiffInPx = window.innerWidth - this.storedDimensions.width;
        let heightDiffInPx = window.innerHeight - this.storedDimensions.height;
        // @ts-ignore
        this.editor.layout();

        this.storedDimensions.width = widthDiffInPx;
        this.storedDimensions.height = heightDiffInPx;
    };

    componentDidMount() {
        // This passes an event with the window event object
        this.resizeListener = window.addEventListener('resize', () => {
            if (this.resizeTaskId !== null) {
                clearTimeout(this.resizeTaskId);
            }

            this.resizeTaskId = setTimeout(() => {
                this.resizeTaskId = null;
                this.handleResize();
            }, 300);
        });
    }

    componentWillUnmount() {
        // This passes an event with the window event object
        window.removeEventListener('resize', () => {
            if (this.resizeTaskId !== null) {
                clearTimeout(this.resizeTaskId);
            }

            this.resizeTaskId = setTimeout(() => {
                this.resizeTaskId = null;
                this.handleResize();
            }, 300);
        });
    }

    render() {
        return this.MonacoEditor ? (
            <this.MonacoEditor
                data-testid="monaco"
                theme="vs-dark"
                editorDidMount={(editor) => (this.editor = editor)}
                {...this.props}
            />
        ) : null;
    }
}
export { Monaco };
export default Monaco;
