import { Card } from 'antd';
import "antd/dist/antd.css";
import { baseUrl } from '../AllUrls.js'
const { Meta } = Card;

const Contact=(props)=>{
    return (
      <div>
        <Card
            hoverable
            style={{ width: 140}}
            cover={<img alt="example" src={`${baseUrl}${props.src.url}`} />}>
          <Meta title={props.src.name} description={props.src.size / 1000000+"MB"} />
        </Card>
      </div>
      );
}

export default Contact;
