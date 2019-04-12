import { MonacoEditorProps, MonacoEditorBaseProps } from 'react-monaco-editor';
import { Component, ErrorInfo } from 'react';

class Monaco extends Component<MonacoEditorBaseProps> {
    MonacoEditor: new () => Component<MonacoEditorProps> = require('react-monaco-editor').default;

    render() {
        return this.MonacoEditor ? (
            <this.MonacoEditor
                data-testid="monaco"
                theme="vs-dark"
                editorDidMount={() => null}
                {...this.props}
            />
        ) : null;
    }
}
export { Monaco };
export default Monaco;
