import React, { useEffect, useState } from "react";
import { Button, Form, Container } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";

export default function AmcatFilters({ amcat, index }) {
  const [fields, setFields] = useState(null);
  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {
    if (index && amcat) {
      amcat
        .getFields(index)
        .then((res) => {
          console.log(res);
          setFields(res.data);
        })
        .catch((e) => {
          setFields(null);
        });
    } else {
      setFields(null);
    }
  }, [amcat, index]);

  const onSubmit = (key, value) => {
    let newFieldValues = { ...fieldValues };
    newFieldValues[key] = value;
    if (value === "") {
      console.log("ommitting");
      delete newFieldValues[key];
    }
    setFieldValues(newFieldValues);
  };

  const dateFilter = (key, value) => {
    let newFieldValues = { ...fieldValues };

    // this is for the POST method
    if (!newFieldValues.date) {
      newFieldValues["date"] = {};
      newFieldValues.date[key] = extractDateFormat(value);
    } else if (value === null) {
      delete newFieldValues.date;
    } else {
      newFieldValues.date[key] = extractDateFormat(value);
    }
    setFieldValues(newFieldValues);
  };

  const extractDateFormat = (date) => {
    if (!date) return "";
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getUTCFullYear();
    return year + "-" + month + "-" + day;
  };

  const renderFields = () => {
    return Object.keys(fields).map((key) => {
      if (fields[key] === "text") {
        return (
          <Form.TextArea
            key={key}
            value={fieldValues[key] ? fieldValues[key] : ""}
            onChange={(e, d) => onSubmit(key, d.value)}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
          />
        );
      }
      if (fields[key] === "date") {
        return (
          <Container key="date_filter">
            <Form.Field key={key + "_gte"}>
              <SemanticDatepicker
                key="gte"
                type="basic"
                label="Start Date"
                locale={navigator.locale}
                format="YYYY-MM-DD"
                onChange={(e, d) => {
                  e.stopPropagation();

                  dateFilter("gte", d.value);
                }}
              />
            </Form.Field>
            <Form.Field key={key + "_lte"}>
              <SemanticDatepicker
                key="lte"
                type="basic"
                label="End Date"
                locale={navigator.locale}
                format="YYYY-MM-DD"
                onChange={(e, d) => {
                  e.stopPropagation();

                  dateFilter("lte", d.value);
                }}
              />
            </Form.Field>
          </Container>
        );
      }
      if (fields[key] === "keyword") {
        return (
          <Form.Field key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              value={fieldValues[key] ? fieldValues[key] : ""}
              onChange={(e) => onSubmit(key, e.target.value)}
            />
          </Form.Field>
        );
      }
      return null;
    });
  };

  if (!fields) return null;
  else
    return (
      <Container>
        <Container>{renderFields()}</Container>
        <br />
        <Button.Group widths={2}>
          <Button className="ui red button" onClick={() => setFieldValues(null)}>
            Reset Filters
          </Button>
        </Button.Group>
      </Container>
    );
}
