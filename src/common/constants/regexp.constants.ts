// 邮箱正则表达式：匹配符合一般邮箱格式的字符串，要求包含用户名和域名部分，且域名后缀为2到4个字母
export const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 电话号码正则表达式：匹配国际、国内电话号码，包括可选的国际区号和括号包围的区号，支持不同格式分隔符（如空格、短横线）
export const PHONE_REGEXP = /^(\+?\d{1,4}[\s-]?)?(\(?\d{2,3}\)?[\s-]?)?[\d\s-]{7,10}$/;

// URL正则表达式：匹配http、https或ftp协议的URL，包含协议部分、域名、路径及可选的查询参数
export const URL_REGEXP = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

// 邮政编码正则表达式：匹配5位数字的邮政编码，支持带4位扩展部分的格式（如12345-6789）
export const POSTAL_CODE_REGEXP = /^[0-9]{5}(?:-[0-9]{4})?$/;

// IP地址正则表达式：匹配IPv4地址，要求每个段为0-255之间的数字，四个段之间用点分隔
export const IP_ADDRESS_REGEXP =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// 用户名正则表达式：匹配3到16个字符的用户名，仅允许字母、数字、下划线和短横线
export const USERNAME_REGEXP = /^[a-zA-Z0-9_-]{3,16}$/;

// 密码正则表达式：匹配包含至少一个小写字母、一个大写字母和一个数字的8位或更长密码
export const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// 网址正则表达式（不带协议）：匹配没有协议部分的URL，要求有一个域名和可选的路径
export const SIMPLE_URL_REGEXP = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 16进制颜色代码正则表达式：匹配简短的3位或标准的6位16进制颜色代码，可以带#或不带#
export const HEX_COLOR_REGEXP = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
