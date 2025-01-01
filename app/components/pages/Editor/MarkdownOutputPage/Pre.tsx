import { isValidElement, ReactNode } from "react";
import { Components } from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";
import language from "react-syntax-highlighter/dist/esm/languages/hljs/1c";
import { Box } from "~/components/atoms/Box/Box";
import { Text } from "~/components/atoms/Text/Text";

function extractCodeBlockMetadata(className: string) {
  const classList = className ? className.split(":") : [];
  const language = classList[0]?.replace("language-", "");
  const fileName = classList[1];
  return { language, fileName };
}

function getChildren(children: ReactNode) {
  if (isValidElement(children)) {
    return children;
  }
  throw new Error("Invalid children");
}

export const Pre: Components["pre"] = (props) => {
  // `pre > code`の構造になっているため、`code`要素を取得する
  const codeElement = getChildren(props.children);
  // `code`要素の`className`属性から言語を取得する
  const { language, fileName } = extractCodeBlockMetadata(
    codeElement.props.className ?? ""
  );

  return (
    <>
      {fileName && (
        <Box bg="#1e1e1e" mt="xs" px="13px" pt="6px">
          <Text size="10px">{fileName}</Text>
        </Box>
      )}
      <Prism style={style} customStyle={{ margin: "0" }} language={language}>
        {String(codeElement.props.children).replace(/\n$/, "")}
      </Prism>
    </>
  );
};
